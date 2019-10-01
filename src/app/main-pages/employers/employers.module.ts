import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { EmployersComponent } from './employers.component';
import { CreateEmployerComponent } from './create-employer/create-employer.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DataTablesModule } from 'angular-datatables';

import { EmployersService } from './employers.service'

@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    DataTablesModule
  ],
  declarations: [
    EmployersComponent,
    CreateEmployerComponent
  ],
  providers: [
    EmployersService
  ]
})
export class EmployersModule { }
