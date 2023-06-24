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

  @Input() width?: number;
  @Input() height?: number;

  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 2,
    'canvasWidth': 400,
    'canvasHeight': 300
  };

  constructor(private dialogRef: NbDialogRef<SignatureDialogComponent>) { }

  ngOnInit(): void {
    this.signaturePadOptions = {
      'minWidth': 2,
      'canvasWidth': this.width? this.width: 400,
      'canvasHeight': this.height? this.height: 300
    }
  }

  ngAfterViewInit() {
    this.signaturePad.fromDataURL('data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=');
  }

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
