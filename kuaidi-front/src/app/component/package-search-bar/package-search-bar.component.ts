import { Component, OnInit, Input, Injectable } from '@angular/core';
import { DataAccessorService } from '../../service/data-accessor.service'
import { Info, InfoType } from '../info'

@Component({
  selector: 'app-package-search-bar',
  templateUrl: './package-search-bar.component.html',
  styleUrls: ['./package-search-bar.component.css']
})
export class PackageSearchBarComponent implements OnInit {

  @Input() inputPackageId: string;
  public displayInfo: Info;
  private dataAccessor: DataAccessorService;

  constructor(dataAccessor: DataAccessorService) {
    this.dataAccessor = dataAccessor;
    this.displayInfo = null;
  }

  ngOnInit(): void {
  }

  getTrackingInfo(): void {
    this.dataAccessor.lookUpPackage(this.inputPackageId, (info) => {
      console.log(info)
      if ("error" in info)
        this.displayInfo = new Info(InfoType.ErrorResponse, info["error"]);
      else
        this.displayInfo = new Info(InfoType.PackageInfo, info["content"]);
    });
  }
}
