import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPageComponent } from './component/admin-page/admin-page.component';
import { CustomerPageComponent } from './component/customer-page/customer-page.component';

const routes: Routes = [
  {path:"admin-page",component: AdminPageComponent},
  {path:"customer-page",component: CustomerPageComponent},
  {path: '', redirectTo: 'customer-page', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
