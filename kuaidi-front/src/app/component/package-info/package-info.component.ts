import { Component, OnInit, Input } from '@angular/core';
import { Info, InfoType } from '../info'
import { Clipboard } from '@angular/cdk/clipboard'
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-package-info',
  templateUrl: './package-info.component.html',
  styleUrls: ['./package-info.component.css']
})
export class PackageInfoComponent implements OnInit {
  constructor(private clipboard: Clipboard) {
  }
  @Input()
  public info: Info;
  packageId: string = "";

  ngOnInit(): void {
    ;
  }
  isErrorMsg(): boolean {
    return this.info.infotype == InfoType.ErrorResponse;
  }
  isPackageInfo(): boolean {
    return this.info.infotype == InfoType.PackageInfo;
  }
  getShippingStates(): Array<Object> {
    return this.info.shippingStates;
  }
  getTransferStates() {
    return this.info.transferStates;
  }

  getTransferLink(): string {
    this.packageId = this.getTransferStates()["转运单号"];
    let companyName = this.getTransferStates()["转运公司"];
    if (companyName === "中通") {
      return "https://www.zto.com/express/expressCheck.html";
    }
    if (companyName === "圆通") {
      return "http://www.yto.net.cn/";
    }
    if (companyName === "顺丰") {
      return "https://www.sf-express.com/cn/sc/dynamic_function/waybill/#search/bill-number/" + this.packageId;
    }
    if (companyName === "ems" || companyName === "EMS") {
      return "http://www.ems.com.cn/mailtracking/you_jian_cha_xun.html";
    }
    return environment.apiUrl;
  }

  getIcon(state: string): string {
    const iconMapping = {
      "1.送往仓库": "store",
      "2.到达机场": "local_airport",
      "3.飞机起飞": "flight_takeoff",
      "4.抵达海关": "flight_land",
      "5.海关清关": "anchor"
    }
    return iconMapping[state]
  }
}
