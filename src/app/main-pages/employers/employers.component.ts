import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AppSettings } from '../../AppConstants'
import { Subject } from 'rxjs';
import { EmployersService } from './employers.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployerModalComponent } from '../general-modal/employer-modal/employer-modal.component';
import { DataTableDirective } from 'angular-datatables';


class Employer {
  uniqueId: string;
  empName: string;
  empAddress: number;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-employers',
  styleUrls: ['./employers.component.scss'],
  templateUrl: './employers.component.html',
})
export class EmployersComponent implements OnInit {

  @ViewChild(DataTableDirective, {}) dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  employers: Employer[] = [];
  dtTrigger = new Subject();
  loading: boolean;

  constructor(private http: HttpClient, private employerService: EmployersService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.initTable();
  }

  initTable() {
    this.loading = true;
    this.dtOptions = {
      destroy: true,
      pagingType: 'full_numbers',
      pageLength: 5,
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $('td', row).unbind('click');
        $('td', row).bind('click', () => {
          self.rowClickHandler(data);
        });
        return row;
      }
    };
    this.employerService.getAllEmployers().subscribe((response: any) => {
      console.log(response);
      const outData = response.map((eachEmployer) => {
        const formData = {
          empUniqueId: eachEmployer.empUniqueId,
          empName: eachEmployer.empName,
          empAddress: eachEmployer.empAddress,
        }
        return formData
      });
      this.employers = outData;
      this.dtTrigger.next();
      this.loading = false;
    });
  }

  rowClickHandler(data) {
    console.log(data);
    const activeModal = this.modalService.open(EmployerModalComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Test Large Modal';
    activeModal.componentInstance.allData = data;
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
}
