import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { MainPagesComponent } from "./main-pages.component";
import { MainDashboardModule } from './main-dashboard/main-dashboard.module';
import { ProfilesModule } from './profiles/profiles.module';
import { MainPagesRoutingModule } from './main-pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { EmployersModule } from './employers/employers.module';
import { LabTestsModule } from './lab-tests/lab-tests.module';




const PAGES_COMPONENTS = [
  MainPagesComponent,
];

@NgModule({
  imports: [
    MainPagesRoutingModule,
    ThemeModule,
    MiscellaneousModule,
    MainDashboardModule,
    ProfilesModule,
    EmployersModule,
    LabTestsModule
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ]
})
export class MainPagesModule {
}
