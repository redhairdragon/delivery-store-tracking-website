import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AdminAccessorService } from 'src/app/service/admin-accessor.service';

@Component({
  selector: 'app-batch-management',
  templateUrl: './batch-management.component.html',
  styleUrls: ['./batch-management.component.css']
})
export class BatchManagementComponent implements OnInit {
  
  @ViewChild('batches') selectionMenu;
  @Input() batchSelected: string;
  batchNames: string[] = ["空","1","2","3"];
    
  constructor(
    private adminService: AdminAccessorService
    ) { }

  ngOnInit(): void {

  }

  test(){
    this.adminService.getBatchListRequest().subscribe(
      res=>{
        console.log(res)
      })
    // console.log(this.selectionMenu.selectedOptions.selected[0]?.value)
  }

}
