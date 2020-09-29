import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataAccessorService {

  constructor(
    private http: HttpClient,
  ) { }

  lookUpPackage(pkgId: string, callback) {
    if (this.validateInput(pkgId) != null) {
      callback({ "error": this.validateInput(pkgId) })
      return
    }
    let infoArray = {
      "content": [{ "Date": "1111", "Description": "Departed From US" },
      { "Date": "11223", "Description": "Leaving Customer" }]
    }
    this.packageInfoRequest(pkgId).subscribe({
      error: (resp) => {
        if (resp.status == 500)
          callback({ "error": "服务器暂时不可用，打电话给 (626)365-6688" })
        if (resp.status == 404)
          callback({ "error": "单号不存在，重新检查/可能管理员还未上传" })
      }, next: (resp) => {
        let states = []
        for (let state in resp.body) {
          if (resp.body[state])
            states.push({
              "Description": state,
              "Time":
                new Date(resp.body[state]).toLocaleDateString()
                + " "
                + new Date(resp.body[state]).toLocaleTimeString()
            })
        }
        states.sort((a, b) => { return new Date(a.time).getTime() - new Date(b.time).getTime() })
        callback({ "content": states })
      }
    })
  }

  validateInput(pkgId: string): string {
    if (!pkgId)
      return "你还没输入单号呢！"

    pkgId = pkgId.trim()
    if (!pkgId.match("^[A-Za-z0-9]+$"))
      return "单号只应该有数字字母，再检查一下吧."
    if (!pkgId)
      return "您还没有输入单号哦!"
    if (pkgId.length != "cl86008927us".length)
      return "您的单号长度对不上呀!"
    return null
  }

  packageInfoRequest(pkgId: string) {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' })
    let params = new HttpParams().set("packageId", pkgId);
    return this.http.get<any>(environment.apiUrl + '/customer/packageInfo',
      { headers: header, observe: 'response', "params": params });
  }

  async setLocalPackageSearchHistory(packageId: string) {
    let history: string = localStorage.getItem("packageHistory")
    if (history) {
      let historyArray: Array<string> = JSON.parse(history)
      if (historyArray.includes(packageId))
        return
      historyArray.push(packageId)
      if (historyArray.length > 4)
        historyArray = historyArray.slice(historyArray.length - 4, historyArray.length)
      localStorage.setItem("packageHistory", JSON.stringify(historyArray))
    } else {
      localStorage.setItem("packageHistory", JSON.stringify([packageId]))
    }
  }

  getLocalPackageSearchHistory(): Array<string> {
    let history: string = localStorage.getItem("packageHistory")
    if (history)
      return JSON.parse(history)
    return []
  }
  clearLocalPackageSearchHistory(){
    localStorage.removeItem("packageHistory")
  }
}
