import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ProfilesComponent } from './profiles.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DataTablesModule } from 'angular-datatables';

import { ProfilesService } from './profiles.service'

@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    DataTablesModule
  ],
  declarations: [
    ProfilesComponent,
    CreateProfileComponent
  ],
  providers: [
    ProfilesService
  ]
})
export class ProfilesModule { }
