import { Component, Input, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployersService } from '../../employers/employers.service';
import { from } from 'rxjs';
import { concatMap, toArray } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogService, NbWindowService } from '@nebular/theme';
import { GeneralDialogComponent } from '../../general-dialog/general-dialog.component';


@Component({
  selector: 'app-employer-modal',
  templateUrl: 'employer-modal.component.html',
  styleUrls: ['employer-modal.component.scss'],
})
export class EmployerModalComponent implements OnInit {

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

  constructor(private dialogService: NbDialogService, private fb: FormBuilder, private activeModal: NgbActiveModal, private employerService: EmployersService) {
  }

  ngOnInit() {

    console.log(this.allData);

    this.loading = true;

    // this.firstForm = this.fb.group({
    //     name: ['', Validators.required],
    //     employerRefId: ['', Validators.required],
    //     costPrice: ['', Validators.required]
    //   });

    this.employerService.getAnEmployer(this.allData[0]).subscribe((response: any) => {
      console.log(response);

      this.checkResponse = response;

      this.loading = false;

      this.firstForm = this.fb.group({
        empName: [response[0].empName, Validators.required],
        empAddress: [response[0].empAddress, Validators.required]
      });

      // this.getAllItems(response[0].itemizeds).then((mappedItems)=>{
      //   console.log(mappedItems);
      //   if(mappedItems!=undefined || mappedItems[0]!=undefined)
      //   {
      //     this.orderDetails = { 
      //       otherData: response[0],
      //       itemData: mappedItems
      //     };
      //     this.loading = false;
      //   }

      // });

    });
  }


  closeModal() {
    this.activeModal.close();
  }

  onFirstSubmit() {
    this.loading = true
    const data = {
      empName: this.firstForm.get('empName').value,
      empAddress: this.firstForm.get('empAddress').value
    };
    this.employerService.updateEmployer(data,this.checkResponse[0].id).subscribe((response)=>{
      console.log(response);
      this.loading=false;
      this.dialogService.open(GeneralDialogComponent, {
        context: {
          title: 'This employer has been successfully updated!',
        },
        hasBackdrop: false
      });
      this.closeModal();
    },error=>{
      console.log(error);
      this.loading=false;
      this.dialogService.open(GeneralDialogComponent, {
        context: {
          title: 'There was an error updating this employer!',
        },
        hasBackdrop: false
      });
      this.closeModal();

    });
  }

  delete() {
    this.loading = true

    this.employerService.deleteEmployer(this.checkResponse[0].id).subscribe((response)=>{
      console.log(response);
      this.loading=false;
      this.dialogService.open(GeneralDialogComponent, {
        context: {
          title: 'This employer has been successfully deleted!',
        },
        hasBackdrop: false
      });
      this.closeModal();
    },error=>{
      console.log(error);
      this.loading=false;
      this.dialogService.open(GeneralDialogComponent, {
        context: {
          title: 'There was an error deleting this employer!',
        },
        hasBackdrop: false
      });
      this.closeModal();

    });    
  }


}
