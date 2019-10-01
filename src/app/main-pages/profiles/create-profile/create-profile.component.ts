import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AppSettings } from '../../../AppConstants';
import RefGenerator from '../../../ref-generator-util';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { ProfilesService } from '../profiles.service';
import { GeneralDialogComponent } from '../../general-dialog/general-dialog.component';
import { NbDateService, NbDialogService, NbStepperComponent } from '@nebular/theme';
import { NbAuthService } from '@nebular/auth';
import { AuthService } from '../../../auth.service';


class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-create-profile',
  styleUrls: ['./create-profile.component.scss'],
  templateUrl: './create-profile.component.html',
})
export class CreateProfileComponent implements OnInit, AfterViewInit {

  @ViewChild('stepper') stepper: NbStepperComponent;
  @ViewChild('stateSelector') stateSelector: any;
  firstForm: FormGroup;
  profileForm: FormGroup;
  testForm: FormGroup;
  thirdForm: FormGroup;
  productList: any;
  userList: any;
  items: FormArray;
  itemProduct: any;
  selectedProduct;
  loading = false;
  statuses;
  min: Date;
  max: Date;
  itemizeds;
  stepOneDisabled = false;
  stepTwoDisabled = false;
  orderIsCompleted = false;
  orderRefId: string;
  tests;
  paymentTypes;
  statesAndLgas = [];
  employers;
  sex;
  lgaDisabled: boolean = true;
  lgaOptions = [{ "id": "", "name": "" }];
  trackLgaSelected;
  checkStateSelected;
  employersList: any;
  testTypesUrl: any;
  profileUniqueId: string;
  testTypesList: any;
  testResults: { _id: number; name: string; title: string; }[];
  profileStored: Object;

  selectedFile: ImageSnippet;
  uploadedImagePath: string;
  profileSucceed: boolean = false;
  profileDetails: any;
  status: { _id: number; name: string; title: string; }[];


  constructor(private authService: NbAuthService, private myAuthService: AuthService, private dialogService: NbDialogService, private fb: FormBuilder, private http: HttpClient, private profileService: ProfilesService, protected dateService: NbDateService<Date>) {
    this.max = this.dateService.addYear(this.dateService.today(), -18);
  }

  ngOnInit() {

    this.testResults = AppSettings.testResults;
    this.tests = AppSettings.tests;
    this.paymentTypes = AppSettings.paymentTypes;
    this.employers = AppSettings.employers;
    this.sex = AppSettings.sex;
    this.statesAndLgas = AppSettings.statesAndLgas;
    this.status = AppSettings.status;

    this.loading = true;

    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      sex: ['', Validators.required],
      stateOrigin: ['', Validators.required],
      lga: [{ value: this.lgaOptions[0].name, disabled: true }, Validators.required],
      address: ['', Validators.required],
      telephone: ['', Validators.compose([Validators.maxLength(20), Validators.required, Validators.pattern("[0-9]*")])],
      employer: ['', Validators.required],
      imagePath: [null, Validators.required]
    });

    this.profileService.employerAndTestList().subscribe((results) => {
      console.log(results);
      this.employersList = results[0];
      this.testTypesList = results[1];



      // this.testForm = this.fb.group({
      //   items: this.fb.array([this.createItem()])
      // });

      this.loading = false;

    });

  }

  ngAfterViewInit() {
    this.loading = true;
    setTimeout(() => {
      this.profileForm.get('lga').setValue(this.lgaOptions[0].name);
      if (this.employersList && this.employersList.length > 0 && this.testTypesList && this.testTypesList.length > 0) {
        this.stateSelector.selectionChange.subscribe((value) => {
          if (value.value != '') {
            this.lgaOptions = [];
            const data = this.statesAndLgas.find((obj) => {
              return this.profileForm.get('stateOrigin').value === obj.state.name;
            });
            this.lgaOptions = data.state.locals;
            if (this.profileForm.get('lga').disabled) {
              this.profileForm.get('lga').enable();
            }
            if (!this.profileForm.get('lga').disabled && this.lgaOptions.length > 0) {
              setTimeout(() => {
                this.profileForm.get('lga').setValue(this.lgaOptions[0].name);
                return;
              }, 500);
            }
            this.loading = false;
          }
          else {
          }
        });
      }

      return;
    }, 3000);
  }

  createItem(): FormGroup {
    // console.log(this.productList[0].name);
    return this.fb.group({
      testName: ['', Validators.required],
      testResult: ['', Validators.required],
      testNote: ['', Validators.required]
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

  onProfileSubmit() {

    this.loading = true;
    this.profileUniqueId = `FH-${RefGenerator.generateRef().toUpperCase()}`;
    const expiryDate = this.dateService.addMonth(this.dateService.today(), 6);
    const empData = {
      emp: this.profileForm.get('employer').value,
    }
    const profileData = {
      firstName: this.profileForm.get('firstName').value,
      lastName: this.profileForm.get('lastName').value,
      dob: this.profileForm.get('dob').value,
      stateOrigin: this.profileForm.get('stateOrigin').value,
      lga: this.profileForm.get('lga').value,
      sex: this.profileForm.get('sex').value,
      telephone: this.profileForm.get('telephone').value, 
      address: this.profileForm.get('address').value,
      employer: this.profileForm.get('employer').value,
      // expiryDate: expiryDate,
      uniqueId: this.profileUniqueId,
      imagePath: this.uploadedImagePath,
      status: "Pending"
    }
    this.profileService.profilePost(profileData).then((response) => {
      this.profileStored = response;
      // this.profileService.employerUpdate({ 'foodhandlers': [response] }, empData.emp.id).then((output) => {
        console.log(response);
        this.profileSucceed = true;

        this.stepOneDisabled = true;
        this.loading = false;
        this.profileForm.markAsDirty();
        this.dialogService.open(GeneralDialogComponent, {
          context: {
            title: 'This Food Handler Profile was successfully entered and the status set to "Pending"!',
          },
          hasBackdrop: false
        });
      // });
    });

  }

  async onSecondSubmit() {
    this.loading = true;
    const token = await this.authService.getToken().toPromise();
    const tester = await this.myAuthService.getUser(token.getPayload().id).toPromise();
    this.profileService.testsPost(this.testForm.get(['items']).value,this.profileStored,tester).subscribe((response) => {
      this.profileService.getAProfile(this.profileUniqueId).then((output)=>{
        console.log(output);
        if(output) {
          this.profileSucceed = true;
          this.profileDetails = output[0];
          console.log(this.profileDetails);       
        this.loading = false;
        this.testForm.markAsDirty();
        this.dialogService.open(GeneralDialogComponent, {
          context: {
            title: 'This profile entry was successfully completed!',
          },
          hasBackdrop: false
        });
        }
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
    });
  }

  resetForm() {
    // this.testForm.reset();
    this.uploadedImagePath = null;
    this.profileForm.reset();
    this.stepper.reset();
  }

  private onSuccess(res) {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'ok';

    this.uploadedImagePath = AppSettings.baseApIURL.substring(0, AppSettings.baseApIURL.length - 1)+res[0].url;
    this.profileForm.patchValue({'imagePath': this.uploadedImagePath});
  }

  private onError() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'fail';
    this.selectedFile.src = '';
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);

      this.selectedFile.pending = true;
      this.profileService.uploadImage(this.selectedFile.file).subscribe(
        (res: any) => {
          this.onSuccess(res);
        },
        (err) => {
          this.onError();
        })
    });

    reader.readAsDataURL(file);
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
