import { Component, Input, OnInit } from '@angular/core';
import { AdminAccessorService } from "../../../service/admin-accessor.service"
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-import-csv',
  templateUrl: './import-csv.component.html',
  styleUrls: ['./import-csv.component.css']
})
export class ImportCsvComponent implements OnInit {
  
  @Input() filename:string;
  public xlsData;
  public batchName:string;
  public showTable:boolean;
  public dataValidationMessage:string;

  constructor(
    private adminService: AdminAccessorService,
    public datepipe: DatePipe
    ) { 
    this.batchName = this.createBatchName()
    this.showTable= false;
  }
  

  ngOnInit(): void {
  }

  fileSelected(event: { target: { files: string | any[]; }; }) {
    if (event.target.files.length !== 1) throw new Error('Cannot use multiple files');
    var file = event.target.files[0]

    this.filename=""
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
      this.showTable= true;
      this.dataValidationMessage="";
      console.log(this.xlsData)
      //validate the data
      this.removeEmpty()
      this.stringifyAll()
      this.completeSequence()
      this.validateData();
      
    };
    reader.readAsBinaryString(file)
  }
  removeEmpty(){
    for(let i = 1; i< this.xlsData.length;++i){
      if (this.xlsData[i].length==0)
        this.xlsData.splice(i, 1);
    }
  }
  completeSequence(){
    for(let i = 1; i< this.xlsData.length;++i){
      this.xlsData[i][0]=i
    }
  }
  validateData(){
    if (this.xlsData.length<=1){
      this.dataValidationMessage="请重新上传,原因: " + "没有数据";
      return 
    }
      
    var badRows:Array<any>=[]
    for(let i = 1; i< this.xlsData.length;++i){
      if (this.xlsData[i][1]===undefined)
        badRows.push(i)
    }
    if (badRows.length!=0){
      this.dataValidationMessage="请重新上传,原因: "+"第"+badRows.join()+"行单号没找到"
      return
    }

    var packageIdSet=new Set()
    for(let i = 1; i< this.xlsData.length;++i)
        packageIdSet.add(this.xlsData[i][1])
    if(packageIdSet.size < this.xlsData.length-1)
      this.dataValidationMessage="请重新上传,原因: "+"单号你怎么还能输重复了？"
  }
  stringifyAll(){
    for(let i = 1; i< this.xlsData.length;++i){
      for(let j = 1; j< this.xlsData[i].length;++j){
        this.xlsData[i][j]=new String(this.xlsData[i][j])
      }
    }

  }

  upload(){
    if(this.showTable==false){
      this.dataValidationMessage="选择一个文件先"
      return
    }
    this.adminService.uploadBatchRequest(this.xlsData,this.batchName).subscribe({
      next:(response)=>{},
      error:(response)=>{}
    });
  }

  createBatchName(): string {
    return "批次" + this.datepipe.transform(new Date(), 'yyyy-MM-dd');
  }
  reset(){
    this.xlsData=null
    this.showTable=false
    this.dataValidationMessage=""
  }
}
