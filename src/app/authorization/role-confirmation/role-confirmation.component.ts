import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-role-confirmation',
  templateUrl: './role-confirmation.component.html',
  styleUrls: ['./role-confirmation.component.scss']
})
export class RoleConfirmationComponent implements OnInit {

  role: string = '';

  constructor(private dialogRef: NbDialogRef<RoleConfirmationComponent>) { }

  ngOnInit(): void {
  }

  confirm(): void {
    this.dialogRef.close(this.role);
  }

  cancel(): void {
    this.dialogRef.close('');
  }

}
