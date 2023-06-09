import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss']
})
export class DeleteConfirmationComponent implements OnInit {
  
  @Input() data: any;
  
  constructor(private dialogRef: NbDialogRef<DeleteConfirmationComponent>) { }

  ngOnInit(): void {
  }

  confirm(): void {
    this.dialogRef.close('affirm');
  }

  cancel(): void {
    this.dialogRef.close('');
  }
}
