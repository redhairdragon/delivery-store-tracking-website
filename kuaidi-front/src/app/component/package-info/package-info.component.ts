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

}
