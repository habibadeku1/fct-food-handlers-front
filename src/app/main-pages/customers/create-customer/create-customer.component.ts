import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AppSettings } from '../../../AppConstants';
import RefGenerator from '../../../ref-generator-util';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { CustomersService } from '../customers.service';
import { GeneralDialogComponent } from '../../general-dialog/general-dialog.component';
import { NbDateService, NbDialogService } from '@nebular/theme';


@Component({
  selector: 'app-create-customer',
  styleUrls: ['./create-customer.component.scss'],
  templateUrl: './create-customer.component.html',
})
export class CreateCustomerComponent implements OnInit {

  firstForm: FormGroup;
  loading = false;

  constructor(private dialogService: NbDialogService, private fb: FormBuilder, private http: HttpClient, private customerService: CustomersService, protected dateService: NbDateService<Date>) {
  }

  ngOnInit() {

    this.loading = true;

    this.firstForm = this.fb.group({
        username: ['', Validators.required],
        email: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        businessName: ['', Validators.required],
        telephone: ['', Validators.required],
      });

      this.loading = false;
  }

  onFirstSubmit() {
    this.loading = true;
    const customerData = {
      username: this.firstForm.get('username').value,
      email: this.firstForm.get('email').value,
      firstName: this.firstForm.get('firstName').value,
      lastName: this.firstForm.get('lastName').value,
      businessName: this.firstForm.get('businessName').value,
      telephone: this.firstForm.get('telephone').value,
      confirmed: true,
      blocked: false
    }
    this.customerService.customerPost(customerData).subscribe((response) => {
      this.loading = false;
      console.log(response);
      this.firstForm.reset();
      this.firstForm.markAsDirty();
      this.dialogService.open(GeneralDialogComponent, {
        context: {
          title: 'This customer was successfully created!',
        },
        hasBackdrop: false
      });
    }, error => {
      console.log(error);
      this.loading = false;
      this.dialogService.open(GeneralDialogComponent, {
        context: {
          title: 'There was a problem creating this customer, please contact the system administrator!',
        },
        hasBackdrop: false
      });
    });
  }

}
