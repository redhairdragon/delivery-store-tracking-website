import { Component, OnInit, Input } from '@angular/core';
import {Info, InfoType} from '../info'

@Component({
  selector: 'app-package-info',
  templateUrl: './package-info.component.html',
  styleUrls: ['./package-info.component.css']
})
export class PackageInfoComponent implements OnInit {
  

  constructor() { }
  @Input()
  public info:Info;
  
  ngOnInit(): void {
    ;
  }
  isErrorMsg():boolean{
    return this.info.infotype==InfoType.ErrorResponse;
  }
  isPackageInfo():boolean{
    return this.info.infotype==InfoType.PackageInfo;
  }
  getStates():Array<Object>{
    return this.info.content;
  }
  getIcon(state:string):string{
    const iconMapping = {
      "1.送往仓库":"store",
      "2.到达机场":"local_airport",
      "3.飞机起飞":"flight_takeoff",
      "4.抵达海关":"flight_land",
      "5.海关清关":"anchor"
    }
    return iconMapping[state]
  }
}
