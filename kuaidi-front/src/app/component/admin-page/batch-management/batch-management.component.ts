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

  public stateMessage: string = "";
  public changed: boolean[] = [];
  public deletable: boolean[] = [];
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

    let currentDate = new Date();
    currentDate.setHours(0)
    currentDate.setMinutes(0)

    this.shippingStates.forEach(() => {
      this.changed.push(false)
      this.date.push(new FormControl(currentDate))
      this.date[this.date.length - 1].disable()
      this.time.push(timeString)
      this.deletable.push(false)
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
  resetForm() {
    let clock = new Date(0)
    clock.setHours(new Date().getHours())
    clock.setMinutes(new Date().getMinutes())
    let timeString = clock.toLocaleTimeString("en-GB").substr(0, 5);

    let currentDate = new Date();
    currentDate.setHours(0)
    currentDate.setMinutes(0)

    this.time.forEach((x, index, time) => { time[index] = timeString })
    this.changed.forEach((x, index, changed) => { changed[index] = false })
    this.date.forEach((x, index, date) => {
      date[index] = new FormControl(currentDate)
      date[index].disable()
    })
  }

  updateBatchStates() {
    if (this.changed.reduce((a,b)=>{return !b?a:++a},0)==0)
      return

    let batchName = this.batchSelectionMenu.selectedOptions.selected[0]?.value;
    let states = [];
    let timeArray = [];
    for (let i = 0; i < this.time.length; i++) {
      if (!this.changed[i]) continue;
      let timestamp: Date = this.date[i].value
      timestamp.setMinutes(parseInt(this.time[i].substr(3, 2)))
      timestamp.setHours(parseInt(this.time[i].substr(0, 2)))
      timeArray.push(timestamp.toISOString().slice(0, 19).replace('T', ' '))
      states.push(this.shippingStates[i])
    }
    this.adminService.updateBatchStatesRequest(batchName, states, timeArray).subscribe({
      next: (resp) => {
        this.stateMessage = "更新成功"
        this.resetForm()
      }, error: (resp) => {
        this.stateMessage = resp.body
      }
    })
  }
  
  toggleModification(idx: number, event: { checked: any; }) {
    this.changed[idx] = event.checked;
    if (event.checked)
      this.date[idx].enable()
    else
      this.date[idx].disable()
  }
  test(){
    this.adminService.getBatchStateRequest("h2").subscribe(
      resp=>{
        console.log(resp)
      }
    )
  }
}

