import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-announcement-confirmation',
  templateUrl: './announcement-confirmation.component.html',
  styleUrls: ['./announcement-confirmation.component.scss']
})
export class AnnouncementConfirmationComponent implements OnInit {

  @Input() data: any;

  constructor(private dialogRef: NbDialogRef<AnnouncementConfirmationComponent>) { }

  ngOnInit(): void {
  }

  confirm(): void {
    this.dialogRef.close('affirm');
  }

  cancel(): void {
    this.dialogRef.close('');
  }
}
