import { Component, OnInit } from '@angular/core';
import { AdminAccessorService } from "../../../service/admin-accessor.service"
import { ToastService } from "../../../service/toast.service"

@Component({
  selector: 'app-upload-price',
  templateUrl: './upload-price.component.html',
  styleUrls: ['./upload-price.component.css']
})
export class UploadPriceComponent implements OnInit {

  constructor(
    private adminService: AdminAccessorService,
    private toaster: ToastService,
  ) { }
  public uploading: boolean = false;

  ngOnInit(): void {
  }

  upload(event){
    let file = event.target.files[0]
    if (file.size > 2000000){
      this.toaster.toast("文件太大了啦")
      return
    }
    console.log(event.target.files[0])
    this.toaster.toast("上传完成")
  }
}
