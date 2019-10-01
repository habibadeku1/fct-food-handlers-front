import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs';

import { AppSettings } from '../../AppConstants';

@Injectable()
export class LabTestsService
{
    token: string;
    constructor(private http: HttpClient) { 
        this.token = localStorage.getItem("app_token");
    }

    public getAllLabTests() {
        return this.http.get(`${AppSettings.baseApIURL}labtesttypes`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
        });
    }

    public employerPost(data) {
        return this.http.post(`${AppSettings.baseApIURL}employers`,data, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
        });        
    }

    public getAnEmployer(id) {
        return this.http.get(`${AppSettings.baseApIURL}employers?empUniqueId_eq=${id}`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
        });
    }

    public updateEmployer(data,id) {
        return this.http.put(`${AppSettings.baseApIURL}employers/${id}`,data, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
        });        
    }

    public deleteEmployer(id) {
        return this.http.delete(`${AppSettings.baseApIURL}employers/${id}`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
        });        
    }

}