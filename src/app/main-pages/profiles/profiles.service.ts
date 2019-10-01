import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { forkJoin, of } from 'rxjs';

import { AppSettings } from '../../AppConstants';
import { resolve } from 'dns';

//import { Papa } from 'papaparse';


@Injectable()
export class ProfilesService
{
    csvData: any[] = [];
    headerRow: any[] = [];
    output: any;
    token: string;
    constructor(private http: HttpClient) { 
        this.token = localStorage.getItem("app_token");
    }

    public getAllProfiles() {
        return this.http.get(`${AppSettings.baseApIURL}foodhandlers`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          })
    }

    public getSomeProfiles(userId) {
      return this.http.get(`${AppSettings.baseApIURL}foodhandlers?userId_eq=${userId}`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
    }

    async mapAllProfiles(data?) {
        const allProfiles = this.http.get(`${AppSettings.baseApIURL}foodhandlers`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }).toPromise();

        await allProfiles.then((response: any)=>{
            const mappedResult = response.map(element => {
                const profileData = {
                  profileId: element.id,
                  status : element.status,
                  // itemsTotalPrice : element.itemizeds.map((obj)=>{ return obj.quantity*obj.salesPrice}).reduce((x, y) => x + y),
                  // itemsTotalQuantity: element.itemizeds.map((obj)=>{ return obj.quantity}).reduce((x, y) => x + y),
                }
                return profileData;
            });
            this.output = mappedResult;            
        }).catch((error)=>console.log(error));
        console.log(this.output);
        return of(this.output);
    }


    public getAProfile(id) {
        return this.http.get(`${AppSettings.baseApIURL}foodhandlers?uniqueId_eq=${id}`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }).toPromise();
    }

    public getAProduct(id) {
        return this.http.get(`${AppSettings.baseApIURL}products?id_eq=${id}`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }).toPromise();
    }

    public employerAndTestList(): Observable<any[]> {
        const employersUrl = this.http.get(`${AppSettings.baseApIURL}employers`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          });
        const testTypesUrl = this.http.get(`${AppSettings.baseApIURL}labtesttypes`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          });
        return forkJoin([employersUrl,testTypesUrl]);
    } 

    public testList() {
      return this.http.get(`${AppSettings.baseApIURL}labtesttypes`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).toPromise();
  } 

    public testsPost(items,profile,tester): Observable<any[]> {
        const buildPosts = items.map((eachItem)=>{
            console.log(eachItem);
            const eachData = {
              'testName': eachItem.testName,
              'testResult': eachItem.testResult,
              'testNote': eachItem.testNote,
              'foodhandler': profile,
              'tester': tester
            }
            return this.http.post(`${AppSettings.baseApIURL}labtests`,eachData, {
                headers: {
                  Authorization: `Bearer ${this.token}`
                }
              });
        });
        return forkJoin(buildPosts);
    }

    public profilePost(data) {
        return this.http.post(`${AppSettings.baseApIURL}foodhandlers`,data, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }).toPromise();        
    }

    public employerUpdate(data,id) {
      return this.http.put(`${AppSettings.baseApIURL}employers/${id}`,data, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }).toPromise();        
    }

    public updateStatus(data,id) {
        return this.http.put(`${AppSettings.baseApIURL}foodhandlers/${id}`,data, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          });        
    }

    
  public uploadImage(image: File) {
    const formData = new FormData();

     formData.append('files', image);

    // const data = new FormData();
    // data.append('files', {
    //   name: `test.jpg`,
    //   type: 'multipart/form-data'
    // });

    return this.http.post(`${AppSettings.baseApIURL}upload`,formData, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });

  }

  
  downloadCSV(header,csvData,title) {
        
    const formData = csvData.map((result)=>{
        return Object.values(result);
    });
    console.log(formData);
    const csv = null
    // const csv = this.papa.unparse({
    //    fields: header,
    //    data: csvData
    // });
 
    // Dummy implementation for Desktop download purpose
    const blob = new Blob([csv]);
    const a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = title+".csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

}