import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPageComponent } from './component/admin-page/admin-page.component';
import { CustomerPageComponent } from './component/customer-page/customer-page.component';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { BatchManagementComponent } from './component/admin-page/batch-management/batch-management.component';
import { ImportCsvComponent } from './component/admin-page/import-csv/import-csv.component';
import { ListInfosComponent } from './component/admin-page/list-infos/list-infos.component';

const routes: Routes = [
  {
    path: "admin-page", component: AdminPageComponent,
    children: [
      {
        path: 'import', // child route path
        component: ImportCsvComponent, 
      },
      {
        path: 'batch',
        component: BatchManagementComponent,
      },
      {
        path: 'list',
        component: ListInfosComponent,
      },
    ],
  },
  { path: "customer-page", component: CustomerPageComponent },
  { path: '', redirectTo: 'customer-page', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
