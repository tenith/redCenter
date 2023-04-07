import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Notification } from '../interfaces/notification';
import { NbDialogRef } from '@nebular/theme';
import { OffLineNotificationService } from './off-line-notification.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications: Notification[] = [];

  updateSubject: Subject<void> = new Subject<void>();

  constructor(private offlineNotificationService: OffLineNotificationService) {}

  setNotification(notifications: Notification[]): void{
    this.notifications = notifications;
    this.updateSubject.next(); 
  }

  loadNotificationFromStorage(): Promise<void> {
    return this.offlineNotificationService.getAll();
  }

  hasNotifications(): boolean{
    return this.notifications.length > 0;
  }

  getNotifications(): Notification[]{
    return this.notifications;
  }

  // markAsRead(notification: Notification): void{
  //   let tempIndex = this.notifications.indexOf(notification);
  //   if(tempIndex < 0)
  //     return;

  //   // notification.isRead = 'true';
  //   this.notifications[tempIndex] = notification;
  // }

  getNotificationObservable() : Observable<any>{
    return this.updateSubject.asObservable();
  }

  removeDuplicationFromStorage(notification : Notification): void{
    this.offlineNotificationService.delete(notification.code);
  }

  addNotification(notification: Notification): void {
    console.log('add notification' + JSON.stringify(notification));
    let tempIndex = this.notifications.indexOf(notification);
    if(tempIndex >=0 ) {
      return;
    }

    this.removeDuplicationFromStorage(notification);

    this.notifications.push(notification);
    this.updateSubject.next();    
  }

  deleteNotification(notification: Notification): void {
    
    let tempIndex = this.notifications.indexOf(notification);
    if(tempIndex >=0 ){
      this.notifications.splice(tempIndex,1);
      this.updateSubject.next();
    }

    this.offlineNotificationService.delete(notification.code);
  }

  deleteNotificationReadOnlyDocuemntByCode(code: string): void{
    const tempIndex = this.notifications.findIndex(object=>{return object.code === code;});
    if(tempIndex >= 0){
      if(this.notifications[tempIndex].acknowledgeRequired == 'false'){
        this.notifications.splice(tempIndex,1);
        this.updateSubject.next();
      }
    }
  }

  deleteNotificationDocuemntByCode(code: string): void{
    const tempIndex = this.notifications.findIndex(object=>{return object.code === code;});
    if(tempIndex >= 0){
      this.updateSubject.next();
      this.notifications.splice(tempIndex,1);
      // this.changeDetectorRefs.detectChanges();
    }
  }

  deleteAllNotification(): void{
    this.notifications = [];
    this.updateSubject.next();
  }
  
}
