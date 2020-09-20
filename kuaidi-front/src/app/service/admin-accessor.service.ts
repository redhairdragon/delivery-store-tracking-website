import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminAccessorService {

  constructor(private http: HttpClient) {
  }

  loginRequest(password_: string) {
    const loginHeader = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.http.post<any>(environment.apiUrl + '/admin/login',
      { password: password_ },
      { headers: loginHeader, observe: "response" });
  }
}
