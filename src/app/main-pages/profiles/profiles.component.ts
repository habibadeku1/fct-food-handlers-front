import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AppSettings } from '../../AppConstants'
import { ProfilesService } from './profiles.service';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralModalComponent } from '../general-modal/general-modal.component';
import * as _ from "lodash";
import { DataTableDirective } from 'angular-datatables';
import { NbAuthService } from '@nebular/auth';
import { AuthService } from '../../auth.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';



class Profile {
  id: string;
  firstName: string;
  lastName: string;
  sex: string;
  expiryDate: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-profiles',
  styleUrls: ['./profiles.component.scss'],
  templateUrl: './profiles.component.html',
})
export class ProfilesComponent implements OnDestroy, OnInit {

  @ViewChild(DataTableDirective, {}) dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  profiles: Profile[] = [];
  allProfiles;
  dtTrigger = new Subject();
  loading = false;
  userData: string;
  user: any;

  constructor(private myAuthService: AuthService, private authService: NbAuthService, private http: HttpClient, private profileService: ProfilesService, private modalService: NgbModal) {
    this.userData = localStorage.getItem('user_type');
  }

  ngOnInit(): void {

    this.initTable();

  }

  initTable() {
    this.loading = true;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      destroy: false,
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $('td', row).unbind('click');
        $('td', row).bind('click', () => {
          self.rowClickHandler(data);
        });
        return row;
      }
    };
    const checkType = localStorage.getItem('user_type');
    const checkUser = localStorage.getItem('user_id');

    if (checkType === 'authenticated') {
      this.profileService.getSomeProfiles(checkUser).subscribe((response: any) => {
        const outData = response.map((eachProfile) => {
          const formData = {
            id: eachProfile.uniqueId,
            firstName: eachProfile.firstName,
            lastName: eachProfile.lastName,
            sex: eachProfile.sex,
            expiryDate: eachProfile.expiryDate,
            employer: eachProfile.employer.empName,
            status: eachProfile.status,
            labtests: eachProfile.labtests
          }
          return formData
        });
        //console.log(outData);
        this.profiles = outData;
        this.dtTrigger.next();
        this.loading = false;
      });
    }
    else if (checkType === 'super_admin' || checkType === 'administrator' || checkType === 'field_operator' || checkType === 'lab_operator') {
      this.profileService.getAllProfiles().subscribe((response: any) => {
        const outData = response.map((eachProfile) => {
          const formData = {
            id: eachProfile.uniqueId,
            firstName: eachProfile.firstName,
            lastName: eachProfile.lastName,
            sex: eachProfile.sex,
            expiryDate: eachProfile.expiryDate,
            employer: eachProfile.employer.empName,
            status: eachProfile.status,
            labtests: eachProfile.labtests
          }
          return formData
        });
        //console.log(outData);
        this.profiles = outData;
        this.dtTrigger.next();
        this.loading = false;
      });
    }
    else {
      this.authService.onTokenChange()
        .subscribe((token: any) => {
          if (token.isValid()) {
            this.user = token.getPayload();
            console.log(this.user)
            this.myAuthService.getUser(this.user.id).subscribe(async (user: any) => {
              console.log(user);
              localStorage.setItem('user_id', user.id);
              localStorage.setItem('user_type', user.role.type);
              const checkType = localStorage.getItem('user_type');
              const checkUser = localStorage.getItem('user_id');
              if (checkType === 'authenticated') {
                this.profileService.getSomeProfiles(checkUser).subscribe((response: any) => {
                  const outData = response.map((eachProfile) => {
                    const formData = {
                      id: eachProfile.uniqueId,
                      firstName: eachProfile.firstName,
                      lastName: eachProfile.lastName,
                      sex: eachProfile.sex,
                      expiryDate: eachProfile.expiryDate,
                      employer: eachProfile.employer.empName,
                      status: eachProfile.status,
                      labtests: eachProfile.labtests
                    }
                    return formData
                  });
                  //console.log(outData);
                  this.profiles = outData;
                  this.dtTrigger.next();
                  this.loading = false;
                });
              }
              else if (checkType === 'super_admin' || checkType === 'administrator' || checkType === 'field_operator' || checkType === 'lab_operator') {
                this.profileService.getAllProfiles().subscribe((response: any) => {
                  const outData = response.map((eachProfile) => {
                    const formData = {
                      id: eachProfile.uniqueId,
                      firstName: eachProfile.firstName,
                      lastName: eachProfile.lastName,
                      sex: eachProfile.sex,
                      expiryDate: eachProfile.expiryDate,
                      employer: eachProfile.employer.empName,
                      status: eachProfile.status,
                      labtests: eachProfile.labtests
                    }
                    return formData
                  });
                  //console.log(outData);
                  this.profiles = outData;
                  this.dtTrigger.next();
                  this.loading = false;
                });
              }
            });
          }

        });
    }

  }

  rowClickHandler(data) {
    console.log(data);
    const activeModal = this.modalService.open(GeneralModalComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Test Large Modal';
    activeModal.componentInstance.dataId = data[0];
  }

  refresh() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.initTable();
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  printToExcel() {
    const dCol = ["Profile ID", "Name", "Employer", "Expiration Date", "Test Results"];
    const data = ["Profile ID", "Name", "Employer", "Expiration Date", "Test Results"];
    // const b = this.datasources[0].data.map(function(i) {  return [i.month,i.value];  });
    this.dtElement.dtInstance.then((dtIn: DataTables.Api) => {
      console.log(dtIn.data)
    });
    // this.profileService.downloadCSV(dCol, b, this.title);
  }

  public captureScreen() {
    this.loading = true;
    const today = new Date();
    const dd = today.toISOString();
    const data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      const imgWidth = 150;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 30, 20, imgWidth, imgHeight);
      pdf.save('Report_' + dd.toString() + '.pdf'); // Generated PDF
      this.loading = false;
    });
  }

}
