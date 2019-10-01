import { Component, Input, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomersService } from '../../customers/customers.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogService, NbWindowService } from '@nebular/theme';
import { GeneralDialogComponent } from '../../general-dialog/general-dialog.component';


@Component({
  selector: 'app-customer-modal',
  templateUrl: 'customer-modal.component.html',
  styleUrls: ['customer-modal.component.scss'],
})
export class CustomerModalComponent implements OnInit {

  allData: string;
  loading = false;
  orderDetails;
  statuses;
  selectedStatus;
  firstForm;
  orderId;

  @ViewChild('contentTemplate') contentTemplate: TemplateRef<any>;
  @ViewChild('disabledEsc', { read: TemplateRef }) disabledEscTemplate: TemplateRef<HTMLElement>;
  checkResponse: any;

  constructor(private dialogService: NbDialogService, private fb: FormBuilder, private activeModal: NgbActiveModal, private customerService: CustomersService) {
  }

  ngOnInit() {
    
    this.loading = true;

    this.customerService.getACustomer(this.allData[0]).subscribe((response: any) => {

      this.checkResponse = response;

      this.loading = false;

      this.firstForm = this.fb.group({
        username: [response[0].username, Validators.required],
        email: [ response[0].email, Validators.required],
        firstName: [response[0].firstName, Validators.required],
        lastName: [response[0].lastName, Validators.required],
        businessName: [response[0].businessName, Validators.required],
        telephone: [response[0].telephone, Validators.required]
      });

    });
  }


  closeModal() {
    this.activeModal.close();
  }

  onFirstSubmit() {

    this.loading = true
    const data = {
      username: this.firstForm.get('username').value,
      email: this.firstForm.get('email').value,
      firstName: this.firstForm.get('firstName').value,
      lastName: this.firstForm.get('lastName').value,
      businessName: this.firstForm.get('businessName').value,
      telephone: this.firstForm.get('telephone').value
    };
    this.customerService.updateCustomer(data,this.checkResponse[0].id).subscribe((response)=>{
      console.log(response);
      this.loading=false;
      this.dialogService.open(GeneralDialogComponent, {
        context: {
          title: 'This customer has been successfully updated!',
        },
        hasBackdrop: false
      });
      this.closeModal();
    },error=>{
      console.log(error);
      this.loading=false;
      this.dialogService.open(GeneralDialogComponent, {
        context: {
          title: 'There was an error updating this customer!',
        },
        hasBackdrop: false
      });
      this.closeModal();

    });
  }

  delete() {
    this.loading = true

    this.customerService.deleteCustomer(this.checkResponse[0].id).subscribe((response)=>{
      console.log(response);
      this.loading=false;
      this.dialogService.open(GeneralDialogComponent, {
        context: {
          title: 'This customer has been successfully deleted!',
        },
        hasBackdrop: false
      });
      this.closeModal();
    },error=>{
      console.log(error);
      this.loading=false;
      this.dialogService.open(GeneralDialogComponent, {
        context: {
          title: 'There was an error deleting this customer!',
        },
        hasBackdrop: false
      });
      this.closeModal();

    });    
  }


}
