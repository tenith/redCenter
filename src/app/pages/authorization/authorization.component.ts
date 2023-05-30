import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { FirestoreUser } from '../../@core/shared/interfaces/firestore-user';
import { FirestoreUserService } from '../../@core/shared/services/firestore-user.service';
import { ConfirmationComponent } from './confirmation/confirmation.component';

import { aocOptions, levelOptions, roleOptions } from '../../../environments/myconfigs';
import { Observable, Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'ngx-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit, OnDestroy {
  loading = true;
  firestoreUser: FirestoreUser;

  searchEmail: string;

  dialogRef: NbDialogRef<ConfirmationComponent>;

  roleOptions = roleOptions;
  levelOptions = levelOptions
  aocOptions = aocOptions;

  
  online: boolean = true;
  offlineEvent: Observable<Event>;
  onlineEvent: Observable<Event>;
  subscriptions: Subscription[] = [];

  constructor(private firestoreUserService: FirestoreUserService, private toastr: NbToastrService, private dialogService: NbDialogService, private cdr: ChangeDetectorRef) { }


  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngOnInit(): void {
    this.handleAppConnectivityChanges();
  }

  private handleAppConnectivityChanges(): void {
    this.online = navigator.onLine;
    
    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');

    this.subscriptions.push(this.onlineEvent.subscribe(e => {
      // handle online mode
      this.online = true;
      this.cdr.detectChanges();
    }));

    this.subscriptions.push(this.offlineEvent.subscribe(e => {
      // handle offline mode
      this.online = false;
      this.cdr.detectChanges();
    }));
  }

  search(): void {    
    this.firestoreUser = null;
    this.loading = true;

    this.firestoreUserService.getFirestoreUserByEmail(this.searchEmail).then(data => {
      this.loading = false;
      if(data != null){
        this.firestoreUser = data.data() as FirestoreUser;
      }
    });
  }

  delete(): void{
    if(this.firestoreUser == null)
      return;
    
    if(this.searchEmail == this.firestoreUserService.getFirestoreUser().email)
      return;

    this.dialogRef = this.dialogService.open(ConfirmationComponent);
    this.dialogRef.onClose.subscribe(confirmation => {
      if(confirmation == 'confirm'){
        this.firestoreUserService.deleteFirestoreUser(this.firestoreUser)
        .then(()=>{
          this.toastr.primary('Completed','Delete ' + this.firestoreUser.email + ' completed', {duration:5000});
          this.reset();
        })
        .catch(()=>{
          this.toastr.danger('Error','There is something wrong Please try again.', {duration:5000});
          this.reset();
        });
      }
    });
    
    
  }

  update(): void {
    this.firestoreUserService.reviseFirestoreUser(this.firestoreUser)
    .then(()=>{
      this.toastr.primary('Completed','Updated ' + this.firestoreUser.email + ' completed', {duration:5000});
      this.reset();
    })
    .catch(()=>{
      this.toastr.danger('Error','There is something wrong Please try again.', {duration:5000});
      this.reset();
    });


  }

  reset(): void {
    this.loading = true;
    this.firestoreUser = null;
    this.searchEmail = '';
  }

}
