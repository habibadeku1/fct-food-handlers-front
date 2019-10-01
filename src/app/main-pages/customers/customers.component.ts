import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AppSettings } from '../../AppConstants'
import { Subject } from 'rxjs';
import { CustomersService } from './customers.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerModalComponent } from '../general-modal/customer-modal/customer-modal.component';
import { DataTableDirective } from 'angular-datatables';

class Customer {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  businessName: string;
  telephone: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-customers',
  styleUrls: ['./customers.component.scss'],
  templateUrl: './customers.component.html',
})
export class CustomersComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  customers: Customer[] = [];
  dtTrigger = new Subject();
  @ViewChild(DataTableDirective, {}) dtElement: DataTableDirective;
  loading: boolean;


  constructor(private http: HttpClient, private customerService: CustomersService, private modalService: NgbModal) { }

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
    this.customerService.getAllCustomers().subscribe((response: any) => {
      console.log(response);
      const outData = response.map((eachCustomer) => {
        const formData = {
          username: eachCustomer.username,
          email: eachCustomer.username,
          name: eachCustomer.firstName + " " + eachCustomer.lastName,
          businessName: eachCustomer.businessName,
          telephone: eachCustomer.telephone
        }
        return formData
      });
      this.customers = outData;
      this.dtTrigger.next();
      this.loading = false;
    });
  }

  rowClickHandler(data) {
    console.log(data);
    const activeModal = this.modalService.open(CustomerModalComponent, { size: 'lg', container: 'nb-layout' });
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
