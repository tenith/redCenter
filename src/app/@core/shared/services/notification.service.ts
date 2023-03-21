import { Injectable } from '@angular/core';
import { Notification } from '../interfaces/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications: Notification[] = [];

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

  addNotification(notification: Notification): void {
    console.log('add notification' + JSON.stringify(notification));
    this.notifications.push(notification);
  }

  deleteNotification(notification: Notification): void {
    let tempIndex = this.notifications.indexOf(notification);
    if(tempIndex >=0 )
      this.notifications.splice(tempIndex,1);
  }

  deleteAllNotification(): void{
    this.notifications = [];
  }
  
}
