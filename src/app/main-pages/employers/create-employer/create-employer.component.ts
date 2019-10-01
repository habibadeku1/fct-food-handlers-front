import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AppSettings } from '../../../AppConstants';
import RefGenerator from '../../../ref-generator-util';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { EmployersService } from '../employers.service';
import { GeneralDialogComponent } from '../../general-dialog/general-dialog.component';
import { NbDateService, NbDialogService } from '@nebular/theme';


@Component({
  selector: 'app-create-employer',
  styleUrls: ['./create-employer.component.scss'],
  templateUrl: './create-employer.component.html',
})
export class CreateEmployerComponent implements OnInit {

  firstForm: FormGroup;
  loading = false;
  empUniqueId: string;

  constructor(private dialogService: NbDialogService, private fb: FormBuilder, private http: HttpClient, private employerService: EmployersService, protected dateService: NbDateService<Date>) {
  }

  ngOnInit() {

    this.loading = true;

    this.firstForm = this.fb.group({
      //  name: ['', Validators.required],
        empName: ['', Validators.required],
        empAddress: ['', Validators.required]
      });

      this.loading = false;
  }

  onFirstSubmit() {
    this.loading = true;
    this.empUniqueId = `EMP-${RefGenerator.generateRef().toUpperCase()}`;
    const employerData = {
      empUniqueId: this.empUniqueId,
      empName: this.firstForm.get('empName').value,
      empAddress: this.firstForm.get('empAddress').value
    }
    this.employerService.employerPost(employerData).subscribe((response) => {
      this.loading = false;
      console.log(response);
      this.firstForm.reset();
      this.firstForm.markAsDirty();
      this.dialogService.open(GeneralDialogComponent, {
        context: {
          title: 'Employer was successfully created with Employer Id: '+this.empUniqueId+'!',
        },
        hasBackdrop: false
      });
    }, error => {
      console.log(error);
      this.loading = false;
      this.dialogService.open(GeneralDialogComponent, {
        context: {
          title: 'There was a problem creating this employer, please contact the system administrator!',
        },
        hasBackdrop: false
      });
    });
  }

}
