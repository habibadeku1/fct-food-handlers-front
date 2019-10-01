import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs';

import { AppSettings } from './AppConstants';


@Injectable()
export class AuthService
{
    token: string;
    constructor(private http: HttpClient) { 
        this.token = localStorage.getItem("app_token");
    }

    public getUser(userId) {
        console.log(this.token);
        return this.http.get(`${AppSettings.baseApIURL}users/${userId}`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
        });
    }


}