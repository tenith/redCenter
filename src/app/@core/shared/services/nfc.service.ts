import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NfcService {

  private nfc: any;
  private reader: any;

  constructor() {
    // this.nfc = ('nfc' in navigator) ? navigator.nfc : null;
    // this.reader = null;
  }

  // async initializeNfc(): Promise<boolean> {
  //   try {
  //     if (!this.nfc) {
  //       throw new Error('NFC is not supported on this device.');
  //     }

  //     await this.nfc.enable();

  //     return true;
  //   } catch (error) {
  //     console.error('NFC initialization error:', error);
  //     return false;
  //   }
  // }

  // async writeDataToTag(data: string): Promise<boolean> {
  //   try {
  //     if (!this.reader) {
  //       throw new Error('NFC reader is not initialized.');
  //     }

  //     await this.reader.write({recordTyle: 'text', data: data});

  //     return true;
  //   } catch (error) {
  //     console.error('NFC write error:', error);
  //     return false;
  //   }
  // }

  // async startNfcReading(): Promise<string> {
  //   try {
  //     if (!this.nfc) {
  //       throw new Error('NFC is not supported on this device.');
  //     }

  //     await this.nfc.watch((message: any) => {
  //       const record = message.records[0];
  //       if (record.recordType === 'text') {
  //         const data = record.data;
  //         // Do something with the received data
  //         console.log('Received data:', data);
  //       }
  //     }, { mode: 'any', signal: new AbortSignal() });

  //     return 'NFC reading started.';
  //   } catch (error) {
  //     console.error('NFC reading error:', error);
  //     return 'NFC reading failed.';
  //   }
  // }

  // async stopNfcReading(): Promise<string> {
  //   try {
  //     if (!this.nfc) {
  //       throw new Error('NFC is not supported on this device.');
  //     }

  //     await this.nfc.cancelWatch();

  //     return 'NFC reading stopped.';
  //   } catch (error) {
  //     console.error('NFC reading stop error:', error);
  //     return 'NFC reading stop failed.';
  //   }
  // }
  
}
