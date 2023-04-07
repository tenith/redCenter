import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Notification } from '../interfaces/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications: Notification[] = [];

  updateSubject: Subject<void> = new Subject<void>();

  constructor() { 
    // this.notifications = [
    //   {...{
    //     owner: "FLT OPS",
    //     subject: "SUBJECT 1",
    //     short_subject: "MINI SUBJECT 1",
    //     link: "LINK",
    //     body: "BODY 1",
    //     isRead: false}
    //   },
    //   {...{
    //     owner: "FLT OPS",
    //     subject: "SUBJECT 2",
    //     short_subject: "MINI SUBJECT 2",
    //     link: "LINK",
    //     body: "BODY 2",
    //     isRead: true}
    //   }
    // ];
  }

  hasNotifications(): boolean{
    return this.notifications.length > 0;
  }

  getNotifications(): Notification[]{
    return this.notifications;
  }

  markAsRead(notification: Notification): void{
    let tempIndex = this.notifications.indexOf(notification);
    if(tempIndex < 0)
      return;

    notification.isRead = 'true';
    this.notifications[tempIndex] = notification;
  }

  getNotificationObservable() : Observable<any>{
    return this.updateSubject.asObservable();
  }

  addNotification(notification: Notification): void {
    console.log('add notification' + JSON.stringify(notification));

    this.updateSubject.next();
    this.notifications.push(notification);
  }

  deleteNotification(notification: Notification): void {
    //console.log('delete notification' + JSON.stringify(notification));
    let tempIndex = this.notifications.indexOf(notification);
    if(tempIndex >=0 ){
      this.updateSubject.next();
      this.notifications.splice(tempIndex,1);
    }
  }

  deleteNotificationByCode(code: string): void{
    const tempIndex = this.notifications.findIndex(object=>{return object.code === code;});
    if(tempIndex >= 0){
      this.updateSubject.next();
      this.notifications.splice(tempIndex,1);
    }
  }

  deleteAllNotification(): void{
    this.updateSubject.next();
    this.notifications = [];
  }
  
}
