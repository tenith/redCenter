import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  constructor(private dialogRef: NbDialogRef<ConfirmationComponent>) { }

  ngOnInit(): void {
  }

  confirm(): void {
    this.dialogRef.close('confirm');
  }

  cancel(): void {
    this.dialogRef.close('');
  }


}
