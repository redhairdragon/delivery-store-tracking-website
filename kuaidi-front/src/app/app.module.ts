import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatCheckboxModule } from '@angular/material/checkbox';
import {MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { NavPageComponent } from './nav-page/nav-page.component';

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
    AdminActionListComponent,
    NavPageComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatButtonModule,
    LayoutModule,
    MatToolbarModule,
    MatIconModule
  ],
  providers: [
    CookieService,
    DatePipe,
    MatDatepickerModule,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {  
}
