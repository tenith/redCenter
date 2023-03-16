import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FirebaseAuthenticationService } from '../../../@core/shared/services/firebase-authentication.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

import { getMessaging, getToken, onMessage } from "firebase/messaging";

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  title = 'af-notification';
  message:any = null;

  numberNotification: number = 0;

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  /*
    01 MAR 2023 by wutthichair
      change userMenu from userMenu = [ { title: 'Profile' }, { title: 'Log out' } ]; to userMenu = [ { title: 'Log out' } ];
  */
  userMenu = [ { title: 'Log out' } ];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              public firebaseUser: FirebaseAuthenticationService,
              public changeDetectorRefs: ChangeDetectorRef,
              public router: Router) {
  }

  public clickToCount(): void{
    this.numberNotification++;
  }

  ngOnInit() {
    this.numberNotification = 0;
    /*
      01 MAR 2023 by wutthichair
        change defualt theme

      02 Mar 2023 by wutthichair
        change defualt theme from 'dark' to 'default'
    */
    this.currentTheme = this.currentTheme = this.themeService.currentTheme;
    // this.themeService.changeTheme(this.currentTheme);
    
    /*
      02 Mar 2023 by wutthichai
        change default user from 'users.nick' to firebaseUser.getFirebaseUser();
    */
    // this.userService.getUsers()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((users: any) => this.user = users.nick);
    this.user = this.firebaseUser.getFirebaseUser();

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

      this.menuService.onItemClick().subscribe(( event ) => {
        this.onItemSelection(event.item.title);
      });

    /*
      16 Mar 2023 wutthichair
        Implement notification feature
    */
    this.requestPermission();
    this.listen();
  }

  /*
      16 Mar 2023 wutthichair
        Implement notification feature
  */
  requestPermission(): void {
    const messaging = getMessaging();
    getToken(messaging, 
     { vapidKey: environment.firebaseConfig.vapidKey}).then(
       (currentToken) => {
         if (currentToken) {
          //  console.log("Hurraaa!!! we got the token.....");
          //  console.log(currentToken);
         } else {
           console.log('No registration token available. Request permission to generate one.');
         }
     }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
    });
  }
  
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      this.numberNotification++;
      // console.log(this.numberNotification);
      // console.log('Message received. ', payload);

      // {"from":"880704583837","messageId":"a6279c3f-3743-4b54-8691-7ff1c6cc527f","notification":{"title":"First Notification","body":"Hello from Jishnu!!"},"data":{"gcm.notification.time":"02 Mar 2023"}}
      // {"from":"880704583837","messageId":"4a5e1b92-d096-49e7-a0e2-7fda3d5971c1","data":{"body":"great match!","Room":"PortugalVSDenmark","Nick":"Mario"}}
      console.log(JSON.stringify(payload));
      // this.message=payload;

      this.changeDetectorRefs.detectChanges();
    });
  }

  onItemSelection(title: string) {
    // Do something on Log out
    if ( title === 'Log out' ) {
      //Redirect to signout component.....
      this.router.navigate(['./authentication/signout']);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
