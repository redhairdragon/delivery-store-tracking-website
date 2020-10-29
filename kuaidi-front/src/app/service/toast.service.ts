import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private _snackBar: MatSnackBar,) { }
  toast(msg: string) {
    this._snackBar.open(msg, "了解！", {
      duration: 3500,
    })
  }
}
