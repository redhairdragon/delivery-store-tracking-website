import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AdminAccessorService } from "../service/admin-accessor.service"
@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private adminService: AdminAccessorService,) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return this.adminService.hasCookie();
  }
}
