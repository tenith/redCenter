import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-role-confirmation',
  templateUrl: './role-confirmation.component.html',
  styleUrls: ['./role-confirmation.component.scss']
})
export class RoleConfirmationComponent implements OnInit {

  @Input() data: any;

  constructor(private dialogRef: NbDialogRef<RoleConfirmationComponent>) { }

  ngOnInit(): void {
    console.log(JSON.stringify({...this.data}));
  }

  confirm(): void {
    this.dialogRef.close('affirm');
  }

  cancel(): void {
    this.dialogRef.close('');
  }

}
