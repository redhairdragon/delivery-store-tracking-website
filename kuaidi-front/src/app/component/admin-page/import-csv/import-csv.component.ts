import { Component, Input, OnInit } from '@angular/core';
import { AdminAccessorService } from "../../../service/admin-accessor.service"
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common'
import { Router } from '@angular/router';
import { ToastService } from "../../../service/toast.service"

@Component({
  selector: 'app-import-csv',
  templateUrl: './import-csv.component.html',
  styleUrls: ['./import-csv.component.css']
})
export class ImportCsvComponent implements OnInit {

  @Input() filename: string;
  public xlsData;
  public batchName: string;
  public showTable: boolean;
  public errorMessage: string;
  public warningMessages: string[];

  constructor(
    private adminService: AdminAccessorService,
    private router: Router,
    public datepipe: DatePipe,
    private toaster: ToastService,
  ) {
    this.batchName = this.createBatchName()
    this.showTable = false;
    this.warningMessages = [];
  }

  ngOnInit(): void {
  }

  closeWarning() {
    this.warningMessages = []
  }

  fileSelected(event: { target: { files: string | any[]; }; }) {
    if (event.target.files.length !== 1) {
      this.errorMessage = 'Cannot use multiple files';
      this.toaster.toast(this.errorMessage)
      return
    }
    var file = event.target.files[0]

    this.filename = ""
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.xlsData = XLSX.utils.sheet_to_json(ws, { header: 1 });
      // console.log(this.xlsData)
      this.showTable = true;
      this.errorMessage = "";
      //validate the data
      // console.log(this.xlsData)
      this.stringifyAll()
      this.trimTable();
      this.completeSequence()

      if (!this.validateData()) {
        this.toaster.toast(this.errorMessage)
      }
    };
    reader.readAsBinaryString(file)
  }

  completeSequence() {
    for (let i = 1; i < this.xlsData.length; ++i) {
      this.xlsData[i][0] = i
    }
  }
  validateData(): boolean {
    if (this.xlsData.length <= 1) {
      this.errorMessage = "请重新上传,原因: " + "没有数据";
      return false
    }

    for (let i = 1; i < this.xlsData.length; ++i) {
      if (this.xlsData[i][1].length != "cl86008927us".length) {
        this.errorMessage = "请重新上传,原因: " + "第" + (i + 1) + " 行单号长度不对"
        return false
      }
    }


    var repeatId: string[] = [];
    var packageIdSet = new Set()
    for (let i = 1; i < this.xlsData.length; ++i) {
      if (packageIdSet.has(this.xlsData[i][1].toString()))
        repeatId.push(this.xlsData[i][1].toString());
      packageIdSet.add(this.xlsData[i][1].toString())
    }
    console.log(repeatId);
    if (packageIdSet.size < this.xlsData.length - 1) {
      this.errorMessage = "请重新上传,原因: " + "单号输重复了";
      this.warningMessages = ["这个不可无视: 出现了两次的单号"].concat(repeatId);
      return false
    }
    return true
  }

  trimTable(): void {
    // console.log(this.xlsData)

    this.warningMessages = []
    const categories = ['seq', 'packageId', 'channel', 'customerName', 'customerPhone', 'brandName', 'brandNameChinese', 'quantity', 'unitPrice', 'dimension', 'unit', 'weight', 'insuredAmount', 'insuranceFee', 'customTax', 'receiverName', 'receiverPhone', 'receiverProvince', 'receiverCity', 'receiverAddress', 'receiverZIP', 'receiverId', 'transferCompany', 'transferPackageId', 'created', 'SKU', 'comment']

    for (let i = 1; i < this.xlsData.length; ++i) {
      if (this.xlsData[i].length > categories.length) {
        this.warningMessages.push("第 " + (i + 1) + " 行多输了.\n");
      }
    }

    var badRows: Array<any> = []
    for (let i = 1; i < this.xlsData.length; ++i) {
      if (this.xlsData[i][1] === undefined && this.xlsData[i].length >= 1)
        badRows.push(i + 1)
    }
    if (badRows.length != 0) {
      this.warningMessages.push("第 " + badRows.join(", ") + " 行单号没找到.\n")
    }

    let temp = this.xlsData;
    this.xlsData = Array();
    temp.forEach((row) => {
      if (row.length > categories.length) {
        this.xlsData.push(row.slice(0, categories.length))
        return
      }
      if (!row[1])
        return
      this.xlsData.push(row)
    })
    // console.log(this.xlsData)
  }

  stringifyAll() {
    for (let i = 1; i < this.xlsData.length; ++i) {
      for (let j = 1; j < this.xlsData[i].length; ++j) {
        if (this.xlsData[i][j] !== undefined)
          this.xlsData[i][j] = new String(this.xlsData[i][j])
      }
    }

  }
  upload() {
    if (this.showTable == false) {
      this.errorMessage = "选择一个文件先"
      this.toaster.toast(this.errorMessage)
      return false
    }
    if (this.batchName.length > 40) {
      this.errorMessage = "批次名字太长"
      this.toaster.toast(this.errorMessage)
      return
    }
    let validationCode = this.validateData();
    if (!validationCode) {
      alert(this.errorMessage)
      return false
    }

    this.adminService.checkBatchNameExistRequest(this.batchName).subscribe({
      next: (response) => {
        if (response === true) {
          if (!confirm("这个批次已经在服务器上了，确定要覆盖吗?")) {
            this.errorMessage = "";
            return false
          }
        }
        this.adminService.uploadBatchRequest(this.xlsData, this.batchName).subscribe({
          next: (response) => {
            this.errorMessage = "上传批次成功";
            this.toaster.toast(this.errorMessage)
          },
          error: (response) => {
            if (response.status === 422) {
              if (response.error === "batch name too long")
                this.errorMessage = "批次名字太长"
              else
                this.errorMessage = response.error
              this.toaster.toast(this.errorMessage)
            }
            if (response.status === 401) {
              this.adminService.clearCookie();
              this.router.navigate(['/admin-page/login'])
            }
            if (response.status === 400) {
              this.errorMessage = "服务器出错了,联系申"
              this.toaster.toast(this.errorMessage)
              this.router.navigate(['/customer-page/'])
            }
          }
        });
      },
      error: (response) => {
        if (response.status === 400) {
          this.errorMessage = "服务器出错了,联系申"
          this.toaster.toast(this.errorMessage)
          this.router.navigate(['/customer-page/'])
        }
      }
    });
  }
  createBatchName(): string {
    return "批次" + this.datepipe.transform(new Date(), 'yyyy-MM-dd');
  }
  reset() {
    this.xlsData = null
    this.showTable = false
    this.errorMessage = ""
  }
}
