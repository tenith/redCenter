import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

import { SignaturePad } from 'angular2-signaturepad';

@Component({
  selector: 'ngx-signature-dialog',
  templateUrl: './signature-dialog.component.html',
  styleUrls: ['./signature-dialog.component.scss']
})
export class SignatureDialogComponent implements OnInit {
  @Input() data: any;
  @ViewChild(SignaturePad) signaturePad!: SignaturePad;

  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 2,
    'canvasWidth': 400,
    'canvasHeight': 300
  };

  constructor(private dialogRef: NbDialogRef<SignatureDialogComponent>) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    console.log('afterviewinit');
    this.signaturePad.fromDataURL('data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=');
  }

  drawStart() {}

  drawComplete() {}

  clearSignature(){
    this.signaturePad.clear();
    this.data = '';
  }

  confirm(): void {
    this.dialogRef.close(this.signaturePad.toDataURL());
  }

  cancel(): void {
    this.clearSignature();
    this.dialogRef.close('');
  }

}
