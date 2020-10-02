import { Component, OnInit } from '@angular/core';
import { AdminAccessorService } from "../../service/admin-accessor.service"
import { Router, ActivatedRoute} from '@angular/router';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  @ViewChild('batchManagementComponent') batchComp;

  constructor(
    private adminService: AdminAccessorService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    ) { 
    }

  ngOnInit( ): void {
    if(!this.isLoggedIn())
      this.router.navigate(['./login'],{relativeTo: this.activatedRoute});
  }
  isLoggedIn(): boolean{
    return this.adminService.hasCookie()
  }
  tabChangeHandler(event){
    if(event.index===1)
      this.batchComp.fetchBatchList()
  }

}
