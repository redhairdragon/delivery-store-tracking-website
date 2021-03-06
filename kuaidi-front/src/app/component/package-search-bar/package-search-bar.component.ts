import { Component, OnInit, Input, Injectable, ElementRef } from '@angular/core';
import { DataAccessorService } from '../../service/data-accessor.service'
import { Info, InfoType } from '../info'
import { ToastService } from "../../service/toast.service"
import { ViewChild } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-package-search-bar',
  templateUrl: './package-search-bar.component.html',
  styleUrls: ['./package-search-bar.component.css']
})
export class PackageSearchBarComponent implements OnInit {
  @ViewChild('searchInput', { read: MatAutocompleteTrigger }) searchInputElement: MatAutocompleteTrigger;
  @ViewChild('search') search: ElementRef;

  @Input() inputPackageId: string;
  public displayInfo: Info;
  public loading: boolean = false;

  constructor(
    public dataAccessor: DataAccessorService,
    private toaster: ToastService,
  ) {
  }

  ngOnInit(): void {
    this.displayInfo = null;
  }

  getTrackingInfo(): void {
    this.loading = true;
    setTimeout(() => {
      this.searchInputElement.closePanel();
    }, 200)
    this.search.nativeElement.blur()


    this.dataAccessor.lookUpPackage(this.inputPackageId, (info) => {
      if ("error" in info) {
        let displayInfo = new Info(InfoType.ErrorResponse, info["error"], null);
        this.toaster.toast(info["error"])
        window.alert(info["error"]);
      }
      else {
        this.dataAccessor.setLocalPackageSearchHistory(this.inputPackageId)
        this.displayInfo = new Info(InfoType.PackageInfo, info["shippingStates"], info["transferStates"]);
      }
      this.loading = false;
    });
  }
}
