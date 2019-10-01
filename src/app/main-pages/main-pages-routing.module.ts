import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { MainPagesComponent } from "./main-pages.component";
import { ProfilesComponent } from './profiles/profiles.component';
import { CreateProfileComponent } from './profiles/create-profile/create-profile.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { EmployersComponent } from './employers/employers.component';
import { CreateEmployerComponent } from './employers/create-employer/create-employer.component';
import { CreateCustomerComponent } from './customers/create-customer/create-customer.component';
import { CustomersComponent } from './customers/customers.component';
import { AuthGuard } from '../auth-guard.service';
import { LabTestsComponent } from './lab-tests/lab-tests.component';

const routes: Routes = [{
  path: '',
  component: MainPagesComponent,
  children: [{
    path: 'profiles',
    component: ProfilesComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: ["super_admin","administrator","field_operator","lab_operator"] }
  },
  {
    path: 'create-profile',
    component: CreateProfileComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: ["super_admin","field_operator"] }
  },
  {
    path: 'employers',
    component: EmployersComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: ["super_admin","administrator","field_operator"] }
  },
  {
    path: 'create-employer',
    component: CreateEmployerComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: ["super_admin","administrator","field_operator"] }
  },
  {
    path: 'lab-tests',
    component: LabTestsComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: ["super_admin","administrator"] }
  },
  // {
  //   path: 'create-customer',
  //   component: CreateCustomerComponent, 
  //   canActivate: [AuthGuard],
  //   data: { expectedRole: ["administrator"] }
  // },
  {
    path: 'main-dashboard',
    component: MainDashboardComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: ["super_admin","administrator"] }
  },
  // {
  //   path: '',
  //   redirectTo: 'orders'
  // //  pathMatch: 'full',
  // }, 
  //  {
  //   path: '',
  //   redirectTo: 'main-dashboard',
  //   pathMatch: 'full',
  // }, 
  {
    path: '#',
    redirectTo: 'profiles',
    // component: NotFoundComponent,
  },
  { path: '', redirectTo: 'profiles', pathMatch: 'full' },
  {
    path: '**',
    redirectTo: 'profiles',
    // component: NotFoundComponent,
  }

],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPagesRoutingModule {
}
