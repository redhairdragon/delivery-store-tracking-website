import { Component, Input, OnInit } from '@angular/core';
import { AdminAccessorService } from "../../../service/admin-accessor.service"



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private adminService: AdminAccessorService,
  ) { }
  public loginMessage: string;
  @Input() public password: string;

  ngOnInit(): void {
    this.loginMessage = '';
  }
  loginWithPassword() {
    var loginSubs = this.adminService.loginRequest(this.password)
      .subscribe({
        next: (response) => {
          console.log(response)
          this.loginMessage = "成功登入!"
        },
        error: (response) => {
          if (response.status == 401)
            this.loginMessage = '登入失败嘞: 密码错误'
          else
            this.loginMessage = '登入失败嘞: 联系申'
        }
      })
    setTimeout(() => loginSubs.unsubscribe(), 1000)
  }

}
