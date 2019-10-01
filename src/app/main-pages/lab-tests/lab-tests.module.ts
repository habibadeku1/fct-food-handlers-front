import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { LabTestsComponent } from './lab-tests.component';
//import { CreateEmployerComponent } from './create-employer/create-employer.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DataTablesModule } from 'angular-datatables';

import { LabTestsService } from './lab-tests.service'

@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    DataTablesModule
  ],
  declarations: [
    LabTestsComponent
  ],
  providers: [
    LabTestsService
  ]
})
export class LabTestsModule { }
