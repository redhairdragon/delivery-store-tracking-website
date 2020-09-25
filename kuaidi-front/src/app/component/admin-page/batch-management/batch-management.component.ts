import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminAccessorService } from 'src/app/service/admin-accessor.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-batch-management',
  templateUrl: './batch-management.component.html',
  styleUrls: ['./batch-management.component.css']
})
export class BatchManagementComponent implements OnInit {

  @ViewChild('batches') batchSelectionMenu;

  public changed: boolean[] = [];
  public date: FormControl[] = [];
  public time: string[] = [];
  public batchNames: string[] = [];
  public shippingStates: string[] = [
    "1.送往仓库",
    "2.飞机起飞",
    "3.抵达海关",
    "4.海关清关"
  ];

  constructor(
    private adminService: AdminAccessorService,
    private router: Router,
  ) {
    let clock = new Date(0)
    clock.setHours(new Date().getHours())
    clock.setMinutes(new Date().getMinutes())
    let timeString = clock.toLocaleTimeString("en-GB").substr(0, 5);
    this.shippingStates.forEach(() => {
      this.changed.push(false)
      this.date.push(new FormControl(new Date()))
      this.date[this.date.length-1].disable()
      this.time.push(timeString)
    })
  }

  ngOnInit(): void {
    this.fetchBatchList()
  }

  fetchBatchList() {
    this.adminService.getBatchListRequest().subscribe({
      next: res => {
        this.batchNames = res
      }, error: (res) => {
        this.adminService.clearCookie()
        this.router.navigate(["/admin-page/login"])
      }
    })

  }
  test() {
    console.log(this.batchSelectionMenu.selectedOptions.selected[0]?.value)
    console.log(this.date)
    console.log(this.time)
    console.log(this.changed)
    let clock = new Date(0)
    clock.setHours(new Date().getHours())
    clock.setMinutes(new Date().getMinutes())
    let timeString = clock.toLocaleTimeString("en-GB").substr(0, 5);
    this.time.forEach((x, index, time) => { time[index] = timeString })

  }
  updateBatchStates() {

    let batchName = this.batchSelectionMenu.selectedOptions.selected[0]?.value;
    let states = this.shippingStates;
    this.adminService.updateBatchStatesRequest(batchName, states, this.time)

  }
  disableForm(idx) {
    if (this.date[idx].disabled)
      this.date[idx].enable()
    else
      this.date[idx].disable()
  }

}
