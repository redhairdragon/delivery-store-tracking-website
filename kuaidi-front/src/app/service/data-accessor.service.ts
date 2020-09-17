import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataAccessorService {

  constructor() { }
  lookUpPackage(pkgId:string) {
    if (this.validateInput(pkgId)!=null) 
      return {"error":this.validateInput(pkgId)};
    //查无此包裹

    let infoArray = {
      "content": [{"Date":"1111","Description":"Departed From US"},
                  {"Date":"11223","Description":"Leaving Customer"}]
    }
    return infoArray;
  }

  validateInput(pkgId:string): string {
    pkgId=pkgId.trim()
    if (!pkgId.match("^[A-Za-z0-9]+$"))
      return "单号只应该有数字字母，再检查一下吧."
    if(!pkgId)
      return "您还没有输入单号哦!"
    if(pkgId.length != "233".length)
      return "您的单号长度对不上呀!"
    return null
  }
}
