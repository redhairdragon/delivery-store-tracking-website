import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DataAccessorService } from '../../../service/data-accessor.service'
import { ToastService } from "../../../service/toast.service"

@Component({
  selector: 'app-price-page',
  templateUrl: './price-page.component.html',
  styleUrls: ['./price-page.component.css']
})
export class PricePageComponent implements OnInit {

  constructor(
    public dataAccessor: DataAccessorService,
    private toaster: ToastService,
  ) { }

  download() {
    this.dataAccessor.priceFileRequest().subscribe({
      next: (response: any) => {
        console.log(response)
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response.body);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
        downloadLink.setAttribute('download', "price.pdf");
        document.body.appendChild(downloadLink);
        downloadLink.click();

        this.toaster.toast("在下载了")
      },
      error: (response) => {
        console.log(response)
        this.toaster.toast("服务器有点问题，不如直接我电话/微信问我吧")
      }
    })
  }

  ngOnInit(): void {
  }

}
