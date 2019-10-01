import { Component, Input, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserData } from '../../../@core/data/users';
import { AnalyticsService } from '../../../@core/utils';
import { LayoutService } from '../../../@core/utils';
import { NbAuthService, NbAuthJWTToken, NbTokenService } from '@nebular/auth';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth.service';


@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  @Input() position = 'normal';

  user: any;

  userMenu = [/*{ title: 'Profile' }, */{ title: 'Log out' }];
  userType: string;

  constructor(private router: Router, private sidebarService: NbSidebarService,
              private myAuthService: AuthService,
              private menuService: NbMenuService,
              private userService: UserData,
              private analyticsService: AnalyticsService,
              private layoutService: LayoutService, private authService: NbAuthService, private tokenService: NbTokenService) {

                // this.authService.onTokenChange()
                // .subscribe((token: NbAuthJWTToken) => {
          
                //   if (token.isValid()) {
                //     this.user = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable 
                //   }
                //   console.log(this.user)
                //   this.myAuthService.getUser(this.user.id).subscribe((user)=>{
                //     console.log(user);
                //   }); 

                // });
  }

  ngOnInit() {
    const checkUser = localStorage.getItem('user_type');

    if(checkUser === "field_operator"){
      this.userType = "Field Operator"
    }
    else if(checkUser === "lab_operator"){
      this.userType = "Lab Operator"
    }
    else if(checkUser === "administrator"){
      this.userType = "Administrator"
    }
    else if(checkUser === "super_admin"){
      this.userType = "Super Administrator"
    }
    
    // this.userService.getUsers()
    //   .subscribe((users: any) => this.user = users.nick);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  logout() {
    // this.tokenService.clear().subscribe(()=>{
    //   localStorage.removeItem("app_token");
    //   localStorage.removeItem("user_type");
    //   localStorage.removeItem("user_id");
    //   this.router.navigate(['auth/login']);
    // })
    this.authService.logout('email').subscribe((result)=>{
      console.log(result);
            localStorage.removeItem("app_token");
      localStorage.removeItem("user_type");
      localStorage.removeItem("user_id");
      this.router.navigate(['auth/login']);
    })

  }

  goToHome() {
    this.menuService.navigateHome();
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }
}
