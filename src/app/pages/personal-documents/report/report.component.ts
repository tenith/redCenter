import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Observable } from 'rxjs';
import { FirestoreUserService } from '../../../@core/shared/services/firestore-user.service';
import { FileUploadDatabaseService } from '../../../@core/shared/services/file-upload-database.service';
import { FileReportService } from '../../../@core/shared/services/file-report.service';
import { FileUploadInformation } from '../../../@core/shared/interfaces/file-upload-information';
import { NgxWatermarkOptions } from 'ngx-watermark';

import { ngxWaterMarkOptions } from '../../../../environments/myconfigs';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  ngxWaterMarkOptions: NgxWatermarkOptions = ngxWaterMarkOptions;

  generatedBy: string = '';
  generatedAt: string = '';

  downloadUrl$: Observable<string>[] = [];
  fileUploadInformation: FileUploadInformation[] = [];

  @ViewChild('printSummary', { static: false }) public dataToExport: ElementRef;

  constructor(private dialogRef: NbDialogRef<ReportComponent>, private firestoreUserService: FirestoreUserService, private fileUploadDatabaseService: FileUploadDatabaseService, private fileReport: FileReportService) { }

  ngOnInit(): void {
    this.fileUploadInformation = this.fileReport.getReportInformation();
    for(let i=0;i<this.fileUploadInformation.length;i++)
      this.downloadUrl$.push(this.fileUploadDatabaseService.getFile(this.fileUploadInformation[i].relativePath));

    this.ngxWaterMarkOptions.text = this.firestoreUserService.getFirestoreUser().email;
    this.generatedBy = this.firestoreUserService.getFirestoreUser().email;
    this.generatedAt = this.getDate();
  }

  getDate(): string{
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(new Date(), 'dd MMM yyy HH:mm:ss');
    return formattedDate;
  }

  print(): void{
    window.print();
  }

  printPDF(): void{
    const doc = new jsPDF();
    const content = this.dataToExport.nativeElement;
    
    
    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position += heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      doc.save('report.pdf');
    }); 
  }

  confirm(): void {
    this.dialogRef.close('affirm');
  }

  cancel(): void {
    this.dialogRef.close('');
  }

}
