import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { tap, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { async } from 'q';

@Injectable()
export class AuthGuard implements CanActivate {
    activate: boolean;

    user = new Map();
    authVar: any;

    constructor(private authService: NbAuthService, private router: Router, private myAuthService: AuthService) {
    }


    async canActivate(route: ActivatedRouteSnapshot) {

        const expectedRole = route.data.expectedRole;

        const isAuth = await this.authService.isAuthenticated().toPromise();

        if (isAuth) {
            const token = await this.authService.getToken().toPromise();
            // console.log(token);
            if(token.isValid()) {
                localStorage.setItem("app_token", token.toString());
                const checkUser = localStorage.getItem('user_type');

                if (checkUser && checkUser != '' && checkUser != undefined) {
                    if (!expectedRole.includes(checkUser)) {
                        this.activate = false;
                        this.router.navigate(['auth/login']);
                        return await this.activate
                    }
                    else {
                        this.activate = await true;
                        return await this.activate
                    }                
                }
                else {
                    this.authVar = null;
                    this.authVar = await this.myAuthService.getUser(token.getPayload().id).toPromise();
                    // console.log(this.authVar);
                    localStorage.setItem('user_type', this.authVar.role.type);
                    localStorage.setItem('user_id', this.authVar.id);
                    if (!expectedRole.includes(this.authVar.role.type)) {
                        this.activate = await false;
                        await this.router.navigate(['auth/login']);
                        return await this.activate
                    }
                    else {
                        this.activate = await true;
                        return await this.activate
                    }
                }
        }
        else {
            this.activate = await false;
            await this.router.navigate(['auth/login']);
        //    return await this.activate
        }
       }
       else {
        this.activate = await false;
        await this.router.navigate(['auth/login']);
    //    return await this.activate
    }

        // await this.authService.isAuthenticated().subscribe(async (value) => {
        //     if (await value) {
        //         await this.authService.getToken().subscribe(async (token) => {
        //             console.log(token);
        //             if (token.isValid()) {
        //                 localStorage.setItem("app_token", token.toString());
        //                 const checkUser = localStorage.getItem('user_type');

        //                 if (checkUser && checkUser != '' && checkUser != undefined) {
        //                     if (!expectedRole.includes(checkUser)) {
        //                         this.activate = false;
        //                         this.router.navigate(['auth/login']);
        //                     }
        //                     else {
        //                         this.activate = true;
        //                         return this.activate;
        //                     }
        //                 }
        //                 else {
        //                     await this.myAuthService.getUser(await token.getPayload().id).subscribe(async (user: any) => {
        //                         await console.log(user);
        //                         await localStorage.setItem('user_type', user.role.type);
        //                         if (!expectedRole.includes(user.role.type)) {
        //                             this.activate = false;
        //                             this.router.navigate(['auth/login']);
        //                         }
        //                         else {
        //                             this.activate = true;
        //                             return this.activate;
        //                         }
        //                     });
        //                 }
        //             }
        //         });
        //     }
        //     else {
        //         this.activate = false;
        //         this.router.navigate(['auth/login']);
        //     }
        // });
    //    return this.activate;

        //     await this.authService.isAuthenticated().subscribe(async(value) => {
        //         if (value) {
        //             await this.authService.onTokenChange()
        //                 .subscribe(async (token: NbAuthJWTToken) => {
        //                     if (token.isValid()) {
        //                         localStorage.setItem("app_token",token.toString());
        //                         const checkUser = this.user.get('user_map');
        //                         console.log(checkUser);

        //                         if(checkUser && checkUser!=null && checkUser!=undefined){
        //                             if (!expectedRole.includes(checkUser.role.type)) {
        //                                 this.router.navigate(['auth/login']);
        //                             }
        //                             else {
        //                                 localStorage.setItem('user_type',checkUser.role.type);
        //                                 this.activate = await true;
        //                                 return this.activate;
        //                             }
        //                         }
        //                         else {
        //                             await this.myAuthService.getUser(token.getPayload().id).subscribe(async (user: any) => {
        //                                 await console.log(user);
        //                                 this.user.set('user_map',user);
        //                                 localStorage.setItem('user_type',user.role.type);

        //                                 if (!expectedRole.includes(user.role.type)) {
        //                                     this.router.navigate(['auth/login']);
        //                                 }
        //                                 else {
        //                                     this.activate = await true;                                        
        //                                     return this.activate;
        //                                 }
        //                             });
        //                         }

        //                     }
        //                     else {
        //                         this.router.navigate(['auth/login']);
        //                         this.activate = await false;
        //                         return this.activate;                            
        //                     }
        //                 });
        //         }
        //         else {
        //             this.router.navigate(['auth/login']);
        //         }
        //     });
        //     return this.activate;

    }
}