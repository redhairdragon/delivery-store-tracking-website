import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AdminAccessorService } from "../../service/admin-accessor.service"

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  public loggedIn:boolean;

  constructor(
    private adminService: AdminAccessorService,
    private cookieService: CookieService
    ) { 
      this.loggedIn = this.hasCookie();
    }

  ngOnInit( ): void {

  }

  hasCookie(): boolean{
    return this.cookieService.check('kuaidi');
  }
}
