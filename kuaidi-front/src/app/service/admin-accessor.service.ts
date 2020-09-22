import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AdminAccessorService {

  constructor(
    private http: HttpClient,
    private cookieService: CookieService) {
  }

  loginRequest(password_: string) {
    const loginHeader = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.http.post<any>(environment.apiUrl + '/admin/login',
      { password: password_ },
      { headers: loginHeader, observe: "response", withCredentials: true });
  }

  uploadBatchRequest(data: Array<any>, batchName: string) {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.http.post<any>(environment.apiUrl + '/admin/uploadBatch',
      { "batchName": batchName, "data": data },
      { headers: header, observe: "response", withCredentials: true });

  }

  hasCookie(): boolean {
    return this.cookieService.check('kuaidi');
  }

}
