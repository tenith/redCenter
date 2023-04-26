import { Component, OnInit } from '@angular/core';
import { Notification } from '../../../@core/shared/interfaces/notification';
import { NotificationService } from '../../../@core/shared/services/notification.service';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';



@Component({
  selector: 'ngx-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  notifications: Notification[];
  constructor(private dialogRef: NbDialogRef<NotificationComponent>, private notificationService: NotificationService, private router: Router) { }

  ngOnInit(): void {
    this.notifications = this.notificationService.getNotifications();
  }

  clearAllNotification(): void{
    // console.log('clear all notification');
    this.notificationService.deleteAllNotification();
    this.notifications = [];
  }

  deleteNotification(notification: Notification): void{
    // console.log('delete notification');
    this.notificationService.deleteNotification(notification);

    this.notifications = this.notificationService.getNotifications();
  }

  markAsRead(notification: Notification): void{
    // this.notificationService.markAsRead(notification);
    if(notification.type == 'document')
      this.router.navigate([notification.link] ,{queryParams:{code:encodeURIComponent(notification.code)}});
    
    if(notification.type == 'ets1')
      this.router.navigate([notification.link] ,{queryParams:{uuid:notification.uuid}});

    this.dialogRef.close();
  }

}
