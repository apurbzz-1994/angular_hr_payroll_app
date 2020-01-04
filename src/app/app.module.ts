import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { PayrollComponent } from './payroll/payroll.component';
import { importType } from '@angular/compiler/src/output/output_ast';
import { PayslipComponent } from './payslip/payslip.component';

@NgModule({
  declarations: [
    AppComponent, 
    PayrollComponent,
    PayslipComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
