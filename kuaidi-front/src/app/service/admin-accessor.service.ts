import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  clearCookie() {
    this.cookieService.delete('kuaidi', "/")
  }

  checkBatchNameExistRequest(batchName: string) {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' })
    let params = new HttpParams().set("batchName", batchName)
    return this.http.get<any>(environment.apiUrl + '/admin/batchNameCheck',
      { headers: header, observe: 'body', "params": params, withCredentials: true });
  }

  getBatchListRequest() {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.http.get<any>(environment.apiUrl + '/admin/batchList',
      { headers: header, observe: 'body', withCredentials: true })
  }
  updateBatchStatesRequest(batchName: string, statesArray: string[], timesArray: any[]) {
    let payload = {
      "batchName": batchName,
      "states": statesArray,
      "times": timesArray
    }
    const header = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.http.post<any>(environment.apiUrl + '/admin/updateBatchStates',
      { payload: payload },
      { headers: header, observe: "response", withCredentials: true });
  }

  getBatchStateRequest(batchName: string) {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' })
    let param = { "batchName": batchName };
    return this.http.get<any>(environment.apiUrl + '/admin/batchStates',
      { headers: header, observe: 'body', withCredentials: true, 'params': param })
  }

  deleteBatchStateRequest(batchName: string, description: string) {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' })
    let params = { "batchName": batchName, "description": description }
    return this.http.delete<any>(environment.apiUrl + `/admin/deleteBatchState`,
      { headers: header, observe: 'response', withCredentials: true, "params": params })
  }

  uploadPriceRequest(file, callback) {
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result;
      const header = new HttpHeaders({ 'Content-Type': 'application/json' })
      callback(this.http.post<any>(environment.apiUrl + '/admin/uploadPrice',
        { file:content },
        { headers: header, observe: "response", withCredentials: true }))
    }
    reader.readAsDataURL(file);

  }
}

