import { Component, Input, OnInit } from '@angular/core';
import { AdminAccessorService } from "../../../service/admin-accessor.service"
import { Router, ActivatedRoute} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private adminService: AdminAccessorService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }
  public loginMessage: string;
  @Input() public password: string;

  ngOnInit(): void {
    this.loginMessage = '';
    console.log("Login page init")
  }
  loginWithPassword() {
    var loginSubs = this.adminService.loginRequest(this.password)
      .subscribe({
        next: (response) => {
          console.log(response)
          this.loginMessage = "成功登入!"
          this._snackBar.open(this.loginMessage,"Dismiss", {
            duration: 2000,
          })
          this.router.navigate(['../'],{relativeTo: this.activatedRoute});
        },
        error: (response) => {
          if (response.status == 401)
            this.loginMessage = '登入失败嘞: 密码错误'
          else
            this.loginMessage = '登入失败嘞: 联系申'
          this._snackBar.open(this.loginMessage,"Dismiss", {
            duration: 2000,
          })
        }
      })
    setTimeout(() => loginSubs.unsubscribe(), 1000)
  }

}
