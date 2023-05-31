import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent implements OnInit {

  @Input() data: string;
  qrData: string = '';

  constructor(private dialogRef: NbDialogRef<QrCodeComponent>) { }

  ngOnInit(): void {
    if(!(this.data == null || this.data == undefined)){
      this.qrData = this.encodeString(this.data).toString();
      this.qrData = this.data;
    }
  }

  confirm(): void {
    this.dialogRef.close('affirm');
  }

  cancel(): void {
    this.dialogRef.close('');
  }

  encodeString(string: string): any[] {
    // ASCII encoding
    const asciiRepresentation = Array.from(string).map((c) => c.charCodeAt(0));

    // One-hot encoding
    const uniqueChars = Array.from(new Set(string));
    const charToIndex = uniqueChars.reduce((map, char, index) => {
      map[char] = index;
      return map;
    }, {});
    const oneHotRepresentation = Array.from(string).map((char) => {
      const vector = Array(uniqueChars.length).fill(0);
      vector[charToIndex[char]] = 1;
      return vector;
    });

    // Zip both representations
    const zippedRepresentation = asciiRepresentation.map((ascii, index) => {
      return [ascii, oneHotRepresentation[index]];
    });

    return zippedRepresentation;
  }

}
