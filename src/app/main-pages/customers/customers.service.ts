import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


import { AppSettings } from '../../AppConstants';

@Injectable()
export class CustomersService
{
    token: string;
    constructor(private http: HttpClient) { 
        this.token = localStorage.getItem("app_token");
    }

    public getAllCustomers() {
        return this.http.get(`${AppSettings.baseApIURL}users`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
        });
    }

    public customerPost(data) {
        return this.http.post(`${AppSettings.baseApIURL}users`,data, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
        });        
    }
    
    public getACustomer(username) {
        return this.http.get(`${AppSettings.baseApIURL}users?username_eq=${username}`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
        });
    }

    public updateCustomer(data,id) {
        return this.http.put(`${AppSettings.baseApIURL}users/${id}`,data, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
        });        
    }

    public deleteCustomer(id) {
        return this.http.delete(`${AppSettings.baseApIURL}users/${id}`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
        });        
    }

}