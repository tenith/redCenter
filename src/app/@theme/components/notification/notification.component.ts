import { Component, OnInit } from '@angular/core';
import { Notification } from '../../../@core/shared/interfaces/notification';
import { NotificationService } from '../../../@core/shared/services/notification.service';



@Component({
  selector: 'ngx-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  notifications: Notification[];
  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.notifications = this.notificationService.getNotifications();
  }

  clearAllNotification(): void{
    console.log('clear all notification');
    this.notificationService.deleteAllNotification();
    this.notifications = [];
  }

  deleteNotification(notification: Notification): void{
    console.log('delete notification');
    this.notificationService.deleteNotification(notification);

    this.notifications = this.notificationService.getNotifications();
  }

  markAsRead(notification: Notification): void{
    notification.isRead = 'true';
    this.notificationService.markAsRead(notification);
  }

}