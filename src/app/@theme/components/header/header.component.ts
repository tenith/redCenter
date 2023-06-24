import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogRef, NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, Subject, Subscription } from 'rxjs';
import { FirebaseAuthenticationService } from '../../../@core/shared/services/firebase-authentication.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

import { NbDialogService } from '@nebular/theme';

import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { FirestoreUserService } from '../../../@core/shared/services/firestore-user.service';
import { NotificationComponent } from '../notification/notification.component';
import { NotificationService } from '../../../@core/shared/services/notification.service';
import { Notification } from '../../../@core/shared/interfaces/notification';
import { SwPush } from '@angular/service-worker';

import { AngularFireMessaging } from '@angular/fire/compat/messaging';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  title = 'af-notification';
  message:any = null;

  currentApplicationVersion = environment.appVersion;

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

  numberOfNotification: number = 0;

  currentTheme = 'default';
  private notification$: Observable<void>;  
  private eventsSubscription!: Subscription;
  /*
    01 MAR 2023 by wutthichair
      change userMenu from userMenu = [ { title: 'Profile' }, { title: 'Log out' } ]; to userMenu = [ { title: 'Log out' } ];
  */
  userMenu = [ { title: 'Log out' } ];

  /**
   * 20 Mar 2023 wutthichair 
   * Add notification menu
   */
  notificationMenu = [ {title: 'Notification(s)'}];

  bc = new BroadcastChannel('background_notification');
  private dialogRef: NbDialogRef<any>;

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              public firebaseUser: FirebaseAuthenticationService,
              public changeDetectorRefs: ChangeDetectorRef,
              public firestoreUserService: FirestoreUserService,
              public dialogService: NbDialogService,
              public notificationService: NotificationService,
              public push: SwPush,
              public afMessaging: AngularFireMessaging,
              public router: Router) {
  }

  ngOnInit() {
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

    // this.notificationService.setChangeDetectorRefs(this.changeDetectorRefs);
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

    this.listenOnBackground();
    this.notificationService.loadNotificationFromStorage().then(result => {
      const temp = [...(result as unknown as Notification[])];
      this.notificationService.setNotification(temp);
    }).catch(error=>console.log(error));

    this.notification$ = this.notificationService.getNotificationObservable();
    this.eventsSubscription = this.notification$.subscribe(()=>{
      this.revisedNotification();
    });

    /*
      20 Mar 2023 wutthichair 
        Implement user firestore....
    */
    // this.firestoreUserService.init();
    // console.log(JSON.stringify(this.firebaseUser.getFirebaseUser()));
    // console.log(JSON.stringify(this.firestoreUserService.getFireStoreUser()));
    // this.firestoreUserService.addToken('test token1');
    // this.firestoreUserService.addToken('test token2');

    // console.log(JSON.stringify(this.firestoreUserService.getFireStoreUser()));
  }

  hasNotification(): boolean{
    // this.changeDetectorRefs.detectChanges();
    return this.notificationService.hasNotifications();
  }

  revisedNotification(): void {
    this.numberOfNotification = this.notificationService.getNotifications().length;
    this.changeDetectorRefs.detectChanges(); 
  }

  listenOnBackground(): void {
    this.bc.onmessage = (ev) => { 
      // let temp = [...JSON.parse(localStorage.getItem('backgroundMessage'))] as unknown as Notification[];
      // temp.push({ ...JSON.parse(ev.data) } as unknown as Notification);
      // localStorage.setItem('backgroundMessage',JSON.stringify(temp));



      this.notificationService.addNotification({ ...JSON.parse(ev.data) } as unknown as Notification);
      this.changeDetectorRefs.detectChanges();
    };
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

          /**
           * 20 Mar 2023 wutthichair 
           * Save token into firestore.
           */
          this.firestoreUserService.addToken(currentToken);
         } else {
          //  console.log('No registration token available. Request permission to generate one.');
         }
     }).catch((err) => {
        // console.log('An error occurred while retrieving token. ', err);
    });
  }
  
  listen() {
    const messaging = getMessaging();
  
    onMessage(messaging, (payload) => {
      this.notificationService.addNotification({ ...payload.data } as unknown as Notification);
      // console.log(JSON.stringify(payload));
      this.changeDetectorRefs.detectChanges();
    });

    
  }
  showNotification(): void{
    // console.log('show notification');
    this.dialogRef = this.dialogService.open(NotificationComponent);
    this.dialogRef.onClose.subscribe(()=>{this.revisedNotification()});
  }

  onItemSelection(title: string) {
    // Do something on Log out
    if ( title === 'Log out' ) {
      //Redirect to signout component.....
      this.router.navigate(['./authentication/signout']);
    }

    // if(title === 'Notification(s)'){
    //   // console.log('notification click');
    // }
  }

  ngOnDestroy() {
    this.bc.removeAllListeners('background_notification');
    this.destroy$.next();
    this.destroy$.complete();

    this.eventsSubscription.unsubscribe();
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
