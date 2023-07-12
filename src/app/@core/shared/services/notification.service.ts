import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Notification } from '../interfaces/notification';
import { OffLineNotificationService } from './off-line-notification.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications: Notification[] = [];

  updateSubject: Subject<void> = new Subject<void>();

  constructor(private offlineNotificationService: OffLineNotificationService) {
  }

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
    try{
      this.offlineNotificationService.delete(notification.code);
    }
    catch(e){}
  }

  addNotification(notification: Notification): void {
    // console.log('add notification' + JSON.stringify(notification));
    let tempIndex = this.notifications.indexOf(notification);
    if(tempIndex >=0 ) {
      return;
    }

    // this.removeDuplicationFromStorage(notification);    
    // this.offlineNotificationService.save(notification);
    this.offlineNotificationService.save(notification.code,notification);

    this.notifications.push(notification);
    this.updateSubject.next();    
  }

  deleteNotification(notification: Notification): void {
    
    let tempIndex = this.notifications.indexOf(notification);
    if(tempIndex >=0 ){
      this.notifications.splice(tempIndex,1);
      this.updateSubject.next();
    }

    try{
      this.offlineNotificationService.delete(notification.code);
    }
    catch(e){
      console.log(e);
    }
  }

  deleteNotificationReadOnlyDocuemntByCode(code: string): void{
    const tempIndex = this.notifications.findIndex(object=>{return object.code === code;});
    // console.log('temp index ' + tempIndex);

    if(tempIndex >= 0){
      // console.log(this.notifications[tempIndex].acknowledgeRequired);
      if(this.notifications[tempIndex].acknowledgeRequired == 'No'){
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
