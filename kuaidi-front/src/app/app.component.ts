import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AdminAccessorService } from './service/admin-accessor.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public adminAccessLink:string;
  constructor(
    private adminService: AdminAccessorService,
    private route: ActivatedRoute,
  ) {
  }
  getAdminAccessLink(){
    return this.adminService.hasCookie()?"/admin-page/list":"/admin-page/login"
  }
  title = 'kuaidi-front';
}
