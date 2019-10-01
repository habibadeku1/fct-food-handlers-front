import { Component, Input, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfilesService } from '../profiles/profiles.service';
import { AppSettings } from '../../AppConstants';
import { from } from 'rxjs';
import { concatMap, toArray } from 'rxjs/operators';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { NbDialogService, NbWindowService, NbDateService } from '@nebular/theme';
import { GeneralDialogComponent } from '../general-dialog/general-dialog.component';
import { NbAuthService } from '@nebular/auth';
import { AuthService } from '../../auth.service';


@Component({
  selector: 'app-general-modal',
  templateUrl: 'general-modal.component.html',
  styleUrls: ['general-modal.component.scss'],
})
export class GeneralModalComponent implements OnInit {

  dataId: string;
  loading = false;
  orderDetails;
  statuses;
  selectedStatus;
  firstForm;
  orderId;
  testForm: FormGroup;


  @ViewChild('contentTemplate') contentTemplate: TemplateRef<any>;
  @ViewChild('disabledEsc', { read: TemplateRef }) disabledEscTemplate: TemplateRef<HTMLElement>;
  userData: string;
  items: FormArray;
  profileStored: any;
  testTypesList: any;
  testResults: { _id: number; name: string; title: string; }[];
  profileId: any;
  profileDetails;
  checked: boolean = false;
  checkedProof: boolean = false;
  profileConfirmed: boolean = false;

  constructor(private authService: NbAuthService, private myAuthService: AuthService, private windowService: NbWindowService, private dialogService: NbDialogService, private fb: FormBuilder, private activeModal: NgbActiveModal, private profileService: ProfilesService, protected dateService: NbDateService<Date>) {
    this.userData = localStorage.getItem('user_type');
  }

  ngOnInit() {
    this.testResults = AppSettings.testResults;
    this.statuses = AppSettings.status;
    this.loading = true;
    // this.firstForm = this.fb.group({
    //   status: ['', Validators.required]
    // });
    this.testForm = this.fb.group({
      items: this.fb.array([this.createItem()]),
      isConfirmed: [false, Validators.requiredTrue]
    });

    this.profileService.getAProfile(this.dataId).then((response: any) => {
      this.profileId = response[0].id;
      this.profileStored = response[0];

      if (this.userData === "lab_operator" && response[0].status === "Pending") {


        // this.getAllItems(response[0].itemizeds).then((mappedItems) => {
        //   console.log(mappedItems);
        //   if (mappedItems != undefined || mappedItems[0] != undefined) {
        //     this.orderDetails = {
        //       otherData: response[0],
        //       itemData: mappedItems
        //     };
        //     this.loading = false;
        //   }
        // });
        this.profileService.testList().then((results) => {
          this.testTypesList = results;
          console.log(this.testTypesList, this.testResults);
          this.loading = false;
        });
      }
      else if (this.userData === "administrator") {
        console.log(response[0]);
        this.firstForm = this.fb.group({
          checkedProofTrue: [false, Validators.requiredTrue]
        });

        // this.getAllItems(response[0].labtests).then((mappedItems) => {
        //   console.log(mappedItems);
        //   if (mappedItems != undefined || mappedItems[0] != undefined) {
        this.profileDetails = {
          mainData: response[0]
        };
        if(this.profileDetails.mainData.status==='Confirmed'){
          this.profileConfirmed = true;
        }
        
        this.loading = false;
        //   }
        // });
        // this.profileService.testList().then((results)=>{
        //   this.testTypesList = results;
        //   console.log(this.testTypesList,this.testResults);
        //   this.loading = false;
        // });   
      }
       
      else {
        this.dialogService.open(GeneralDialogComponent, {
          context: {
            title: 'This profile status is not for your attention, please select another or click the Refresh button!',
          },
          hasBackdrop: false
        });
        this.closeModal();        
      }


    });


  }

  toggle(checked: boolean) {
    this.checked = checked;
  }

  toggleProof(checked: boolean) {
    this.checkedProof = checked;
  }

  createItem(): FormGroup {
    // console.log(this.productList[0].name);
    return this.fb.group({
      testName: ['', Validators.required],
      testResult: ['', Validators.required],
      testNote: ['']
    });
  }

  addItem(): void {
    this.items = this.testForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }

  removeItem(index) {
    this.items = this.testForm.get('items') as FormArray;
    this.items.removeAt(index);
  }

  async getAllItems(items) {
    const allData = [];
    for (let i = 0; i < items.length; i++) {
      await this.profileService.getAProduct(items[i].product).then((response_two: any) => {
        const data = {
          productName: response_two[0].name,
          item: items[i]
        }
        allData.push(data);
      });
    }
    return Promise.resolve(allData);

  }

  closeModal() {
    this.activeModal.close();
  }

  updateStatus() {
    this.loading = true
    this.profileDetails = undefined;
    const expiryDate = this.dateService.addMonth(this.dateService.today(), 6);

    this.profileService.updateStatus({ status: "Confirmed", expiryDate: expiryDate}, this.profileId).subscribe((response) => {
      console.log(response);
      this.profileDetails =  {
        mainData: response
      };
      if(this.profileDetails.mainData.status==='Confirmed'){
        this.profileConfirmed = true;
      }
      this.loading = false;
      // this.dialogService.open(GeneralDialogComponent, {
      //   context: {
      //     title: 'The status of the profile was successfully updated to Confirmed!',
      //   },
      //   hasBackdrop: false
      // });
    //  this.closeModal();

    }, error => {
      console.log(error);
      this.loading = false;
      this.dialogService.open(GeneralDialogComponent, {
        context: {
          title: 'There was an error updating the status of this profile!',
        },
        hasBackdrop: false
      });
      this.closeModal();

    });
  }

  async onSecondSubmit() {
    this.loading = true;
    const token = await this.authService.getToken().toPromise();
    const tester = await this.myAuthService.getUser(token.getPayload().id).toPromise();
    this.profileService.testsPost(this.testForm.get(['items']).value, this.profileStored,tester).subscribe((response) => {
      this.profileService.updateStatus({ status: "Screened" }, this.profileId).subscribe((output) => {
        console.log(output);
        if (output) {
          // this.profileSucceed = true;
          // this.profileDetails = output[0];
          // console.log(this.profileDetails);       
          this.loading = false;
          this.testForm.markAsDirty();
          this.dialogService.open(GeneralDialogComponent, {
            context: {
              title: 'This profile entry was successfully updated to Screened!',
            },
            hasBackdrop: false
          });
        }
        this.closeModal();
      });
    }, error => {
      console.log(error);
      this.loading = false;
      this.dialogService.open(GeneralDialogComponent, {
        context: {
          title: 'There was a problem completing this profile entry, please contact the system administrator!',
        },
        hasBackdrop: false
      });
      this.closeModal();
    });
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('id-card-holder').innerHTML;
    popupWin = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no,date=no');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title></title>
          <style>
          table {
            width: 70mm;
            margin: 0px auto;
            border: 1px #ddd;
            padding: 5px;
            font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
          }
          td {    
            font-size: 9px
            text-align: left;
          }
          tr {    
            text-align: left;
          }
          th {
              text-align: center;
              font-size: 10px
          }      
          tr:nth-child(even){background-color: #f2f2f2;}      
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
}



}
