import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PackageSearchBarComponent } from './component/package-search-bar/package-search-bar.component';
import { PackageInfoComponent } from './component/package-info/package-info.component';
import { CommonModule } from '@angular/common';
import { AdminPageComponent } from './component/admin-page/admin-page.component';
import { CustomerPageComponent } from './component/customer-page/customer-page.component';
import { ImportCsvComponent } from './component/admin-page/import-csv/import-csv.component';
import { BatchManagementComponent } from './component/admin-page/batch-management/batch-management.component';
import { ListInfosComponent } from './component/admin-page/list-infos/list-infos.component';
import { LoginComponent } from './component/admin-page/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { CookieService } from 'ngx-cookie-service';
import { AdminActionListComponent } from './component/admin-page/admin-action-list/admin-action-list.component';
import { DatePipe } from '@angular/common'


@NgModule({
  declarations: [
    AppComponent,
    PackageSearchBarComponent,
    PackageInfoComponent,
    AdminPageComponent,
    CustomerPageComponent,
    ImportCsvComponent,
    BatchManagementComponent,
    ListInfosComponent,
    LoginComponent,
    PageNotFoundComponent,
    AdminActionListComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
  ],
  providers: [CookieService,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
