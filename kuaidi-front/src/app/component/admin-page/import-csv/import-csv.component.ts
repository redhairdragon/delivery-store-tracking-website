import { Component, Input, OnInit } from '@angular/core';
import { AdminAccessorService } from "../../../service/admin-accessor.service"
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common'
import { Router } from '@angular/router';

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

  constructor(
    private adminService: AdminAccessorService,
    private router: Router,
    public datepipe: DatePipe
  ) {
    this.batchName = this.createBatchName()
    this.showTable = false;
  }

  ngOnInit(): void {
  }

  fileSelected(event: { target: { files: string | any[]; }; }) {
    if (event.target.files.length !== 1) throw new Error('Cannot use multiple files');
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
      console.log(this.xlsData)
      //validate the data
      this.removeEmpty()
      this.stringifyAll()
      this.completeSequence()
      this.validateData();
    };
    reader.readAsBinaryString(file)
  }
  removeEmpty() {
    for (let i = 1; i < this.xlsData.length; ++i) {
      if (this.xlsData[i].length == 0)
        this.xlsData.splice(i, 1);
    }
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
    const categories = ['seq', 'packageId', 'channel', 'customerName', 'customerPhone', 'brandName', 'brandNameChinese', 'quantity', 'unitPrice', 'dimension', 'unit', 'weight', 'insuredAmount', 'insuranceFee', 'customTax', 'receiverName', 'receiverPhone', 'receiverProvince', 'receiverCity', 'receiverAddress', 'receiverZIP', 'receiverId', 'transferCompany', 'transferPackageId', 'created', 'SKU', 'comment']
    for (let i = 1; i < this.xlsData.length; ++i) {
      if (this.xlsData[i].length > categories.length) {
        this.errorMessage = "请重新上传,原因: 第" + i + "行多输了";
        return false
      }
    }

    var badRows: Array<any> = []
    for (let i = 1; i < this.xlsData.length; ++i) {
      if (this.xlsData[i][1] === undefined)
        badRows.push(i)
    }
    if (badRows.length != 0) {
      this.errorMessage = "请重新上传,原因: " + "第" + badRows.join() + "行单号没找到"
      return false
    }

    var packageIdSet = new Set()
    for (let i = 1; i < this.xlsData.length; ++i)
      packageIdSet.add(this.xlsData[i][1].toString())
    if (packageIdSet.size < this.xlsData.length - 1) {
      this.errorMessage = "请重新上传,原因: " + "单号你怎么还能输重复了？"
      return false
    }
    return true
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
      return
    }
    if (this.batchName.length > 40) {
      this.errorMessage = "批次名字太长"
      return
    }
    if (this.validateData() === false) {
      alert(this.errorMessage)
      return
    }
    this.adminService.checkBatchNameExistRequest(this.batchName).subscribe({
      next:(response)=>{
        if(response === true){
          if(!confirm("这个批次已经在服务器上了，确定要覆盖吗?"))
            return
        }
        this.adminService.uploadBatchRequest(this.xlsData, this.batchName).subscribe({
          next: (response) => { 
            this.router.navigate(["/admin-page/batch"])
          },
          error: (response) => {
            if (response.status === 422) {
              if (response.error === "batch name too long")
                this.errorMessage = "批次名字太长"
              else
                this.errorMessage = response.error
            }
            if (response.status === 401) {
              this.adminService.clearCookie();
              this.router.navigate(['/admin-page/login'])
            }
            if (response.status === 400) {
              this.errorMessage = "服务器出错了,联系申"
              this.router.navigate(['/customer-page/'])
            }
          }
        });
      },
      error:(response)=>{
        if (response.status === 400) {
          this.errorMessage = "服务器出错了,联系申"
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
