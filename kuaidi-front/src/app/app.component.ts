import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AdminAccessorService } from './service/admin-accessor.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public adminAccessLink: string;
  title = 'kuaidi-front';

  constructor(
    private adminService: AdminAccessorService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  getAdminAccessLink() {
    return this.adminService.hasCookie() ? "/admin-page/list" : "/admin-page/login"
  }

  checkLoginStatus() {
    this.adminService.loginRequest("").subscribe({
        next: () => { },
        error: (res) => {
          this.adminService.clearCookie()
          this.router.navigate(["/admin-page/login"])
        }})
  }

}
