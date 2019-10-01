import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { CustomersComponent } from './customers.component';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DataTablesModule } from 'angular-datatables';

import { CustomersService } from './customers.service'

@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    DataTablesModule
  ],
  declarations: [
    CustomersComponent,
    CreateCustomerComponent
  ],
  providers: [
    CustomersService
  ]
})
export class CustomersModule { }
