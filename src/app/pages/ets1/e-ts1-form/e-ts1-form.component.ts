import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ETS1Data } from '../../../@core/shared/interfaces/e-ts1-data';
import { NgModel } from '@angular/forms';
import { FirestoreUserService } from '../../../@core/shared/services/firestore-user.service';
import { ETS1Service } from '../../../@core/shared/services/e-ts1.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AllStarService } from '../../../@core/shared/services/all-star.service';

import Swal from 'sweetalert2';
import { dummyETS1Data } from '../../../@core/shared/data/dummyETS1Data';
import { loft2023H1ETS1Data } from '../../../@core/shared/data/loft2023H1ETS1Data';
import { coft2023H1ETS1Data } from '../../../@core/shared/data/coft2023H1ETS1Data';
import { cleanETS1Data } from '../../../@core/shared/data/cleanETS1Data';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { SignatureDialogComponent } from '../../e-vr/signature-dialog/signature-dialog.component';
import { TabService } from '../../../@core/shared/services/tab.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ETS1GoogleSheetsService } from '../../../@core/shared/services/e-ts1-google-sheets.service';
import { loft2023H2ETS1Data } from '../../../@core/shared/data/loft2023H2ETS1Data';
import { coft2023H2ETS1Data } from '../../../@core/shared/data/coft2023H2ETS1Data';
import { ETS1NotificationService } from '../../../@core/shared/services/ets1Notification.service';

@Component({
  selector: 'ngx-e-ts1-form',
  templateUrl: './e-ts1-form.component.html',
  styleUrls: ['./e-ts1-form.component.scss']
})
export class ETS1FormComponent implements OnInit, OnDestroy {
  @Input() uuid!: string;

  @Input() eTS1? : ETS1Data;
  @Output() saveEvent = new EventEmitter();

  @Output() afterPrintEvent = new EventEmitter();

  @ViewChild('license1No', {static: false}) license1No!: NgModel;
  @ViewChild('license3No', {static: false}) license3No!: NgModel; 

  @ViewChild('pdfTable', { static: true }) screen: any;  

  @ViewChild('page1', { static: false }) public p1: ElementRef;
  @ViewChild('page2', { static: false }) public p2: ElementRef;

  isAdmin = false;

  isNaN: Function = Number.isNaN;
  parseInt: Function = Number.parseInt;

  readOnlySectionA = false;
  readOnlySectionB = false;
  readOnlySectionC = false;
  readOnlySectionD = false;
  readOnlySectionE = false;
  readOnlySectionF = false;
  readOnlySectionG = false;
  readOnlySectionH = false;
  readOnlySectionI = false; 

  fileName: string = '';

  signatureRef: NbDialogRef<SignatureDialogComponent>;

  constructor(private notiService: ETS1NotificationService, private eTS1GoogleSheetService: ETS1GoogleSheetsService,private tabService: TabService, private dialogService: NbDialogService, private eTS1Service : ETS1Service, private firestoreUserService : FirestoreUserService, private allStarService: AllStarService, private datePipe: DatePipe, private router : Router) { 
  }

  openSignaturePad(name: string, width: number, height: number): void {
    this.signatureRef = this.dialogService.open(SignatureDialogComponent,{
      context: {
        data: this.eTS1[name],
        width: width,
        height: height
      },
      autoFocus: true,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: false
    });
    
    this.signatureRef.onClose.subscribe(confirm => {
      if(confirm != '')
        this.eTS1[name] = confirm;
    });
  }

  reviseFileName(): void {
    if(this.eTS1 == null)
      return;

    let tempFileName = '';
    tempFileName += this.eTS1.staffNo1 + "_";
    if(this.eTS1.linePilot == 'true')
      tempFileName += 'LINEPILOT_';
    if(this.eTS1.ioe == 'true')
      tempFileName += 'IOE_';
    if(this.eTS1.ccq == 'true')
      tempFileName += 'CCQ_';
    if(this.eTS1.cuc == 'true')
      tempFileName += 'STC_';
    
    if(this.eTS1.loft == 'true')
      tempFileName += 'LOFT_';
    if(this.eTS1.skillTest == 'true')
      tempFileName += this.eTS1.skillTestDetail + '_';
    
    if(this.eTS1.ffs == 'true')
      tempFileName += this.eTS1.ffsDetail + '_';
    if(this.eTS1.aq == 'true')
      tempFileName += this.eTS1.aqDetail + '_' + this.eTS1.aqNarrative + '_';
    
    if(this.eTS1.rhs == 'true')
      tempFileName += this.eTS1.rhsDetail + '_';

    if(this.eTS1.ilc == 'true')
      tempFileName += this.eTS1.ilcDetail + '_';
    if(this.eTS1.specialOps == 'true')
      tempFileName += this.eTS1.specialDetail + '_';

    tempFileName += this.eTS1.date;

    this.fileName = tempFileName.replace(/ /g,"_").replace(/,/g,"");
    // console.log('FILE NAME: ' + this.fileName);
  }

  exitForm(): void {
    Swal.fire({
      title: "Do you want to exit from this form? Offline feature will be unavailable.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tabService.removeViewTab(this.uuid);
      }
    });      
  }

  loadFromLocal(): ETS1Data {
    let temp = localStorage.getItem(this.uuid);
    if(temp != null)
      return {...JSON.parse(temp) as ETS1Data};    

    return null;
  }

  saveToLocal(): void {
    localStorage.setItem(this.uuid, JSON.stringify(this.eTS1));    
    this.eTS1Service.updateDateeTS1(this.eTS1);
    Swal.fire(
      'Completed',
      'You saved this form into your device',
      'success'
    );
  }

  ngOnInit(): void {   
    this.isAdmin = this.firestoreUserService.isModerator || this.firestoreUserService.isAdmin;    
    let localETS1 = this.loadFromLocal();    

    // LOAD FROM LOCALSTORAGE IF NOT EXISTS LOAD FROM SERVER

    if(localETS1 != null){
      this.eTS1 = localETS1;
    }
    else{
      this.eTS1 = {...cleanETS1Data};
      this.eTS1.uuid = this.uuid;
      

      this.eTS1Service.geteTS1byUUID(this.uuid).then(doc => {
        if(doc.exists){
          this.eTS1 = {...doc.data() as ETS1Data};        
          this.saveToLocalOnly();
        }
        else
          this.eTS1.ownerEmail = this.firestoreUserService.getFirestoreUser().email;
    
        this.reviseFileName();  
        this.setName3();
        this.reviseReadOnly();
      });
    }

    this.reviseFileName();
  }

  saveToLocalOnly(): void {
    localStorage.setItem(this.uuid, JSON.stringify(this.eTS1));    
  }

  ngOnDestroy(): void {
    localStorage.removeItem(this.uuid);
  }

  // myPrint() : void { 
  //   this.afterPrintEvent.emit(this.eTS1.uuid);
  //   this.router.navigate(['/print', this.eTS1.uuid]);
  // }
  async myPrint(): Promise<void>{    
    let pdf = new jsPDF('p', 'px', 'a4', true);
    const p1C = this.p1.nativeElement;    
    const p2C = this.p2.nativeElement;     
    
    //SAVE PAGE1....
    await html2canvas(p1C, { useCORS: true, scale: 0.4, allowTaint: true , logging: true, } ).then((canvas) => {
      const offset = 0;
      const tableWidth = p1C.offsetWidth;
      const tableHeight = p1C.offsetHeight;       

      // Set the maximum width of the PDF page
      const maxWidth = pdf.internal.pageSize.getWidth() - offset*2;

      // console.log('tableWidth: ' + tableWidth);
      // console.log('tableHeight: ' + tableHeight);

      // console.log('maxwidth: ' + maxWidth);

      // Calculate the scale ratio based on the table width and maximum PDF page width
      const scaleRatio = maxWidth / tableWidth;

      // Calculate the scaled table width and height
      const scaledWidth = tableWidth * scaleRatio;
      const scaledHeight = tableHeight * scaleRatio;

      // console.log('scaleRatio: ' + scaleRatio);

      // Convert the canvas to an image data URL with the scaled dimensions
      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', offset, offset, scaledWidth, scaledHeight);
    }); 

    //SAVE PAGE2....
    await html2canvas(p2C, { useCORS: true, scale: 1, allowTaint: true , logging: true,  } ).then((canvas) => {
      const offset = 0;
      const tableWidth = p2C.offsetWidth;
      const tableHeight = p2C.offsetHeight;       

      // Set the maximum width of the PDF page
      const maxWidth = pdf.internal.pageSize.getWidth() - offset*2;

      // Calculate the scale ratio based on the table width and maximum PDF page width
      const scaleRatio = maxWidth / tableWidth;

      // Calculate the scaled table width and height
      const scaledWidth = tableWidth * scaleRatio;
      const scaledHeight = tableHeight * scaleRatio;

      // Convert the canvas to an image data URL with the scaled dimensions
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', offset, offset, scaledWidth, scaledHeight);
    });
    

    var blob = pdf.output('blob');
    window.open(URL.createObjectURL(blob));
  }

  reviseReadOnly(): void{
    //FOR INSTRUCTOR
    const myEmail = this.firestoreUserService.getFirestoreUser().email;
    
    //ADMIN PERMISSION.....
    /*
      13 JUL 2023 by wutthichair@airasia.com
      change checking admin status from service to be paramter 'this.isAdmin'
    */
    if(this.isAdmin){
      if(this.eTS1.submitDateTime != ''){
        this.readOnlySectionA = true;
        this.readOnlySectionB = true;
        this.readOnlySectionC = true;
        this.readOnlySectionD = true;
        this.readOnlySectionE = true;
        this.readOnlySectionF = true;
        this.readOnlySectionG = true;
        this.readOnlySectionH = true;
        this.readOnlySectionI = false;
      }
      else{
        this.readOnlySectionI = true;
      }
      //SUPER USER WITH SPECIAL CODE CAN EDIT....
      if(this.eTS1.signatureStaff1Date == '2020-02-20'){
        this.readOnlySectionA = false;
        this.readOnlySectionB = false;
        this.readOnlySectionC = false;
        this.readOnlySectionD = false;
        this.readOnlySectionE = false;
        this.readOnlySectionF = false;
        this.readOnlySectionG = false;
        this.readOnlySectionH = false;
        this.readOnlySectionI = false;
      }

      //FINALIZED FORM NO ONE CAN EDIT.....
      if(this.eTS1.completedDateTime != ''){
        this.readOnlySectionA = true;
        this.readOnlySectionB = true;
        this.readOnlySectionC = true;
        this.readOnlySectionD = true;
        this.readOnlySectionE = true;
        this.readOnlySectionF = true;
        this.readOnlySectionG = true;
        this.readOnlySectionH = true;
        this.readOnlySectionI = true;
      }
    }

    //USER PERMISSION.....
    if(this.allStarService.getRole(myEmail) == 'USER'){
      //ONLY ADMIN CAN EDIT SECTION I.....
      this.readOnlySectionI = true;

      //IF THIS ETS1 HAS BEEN ALREADY SUBMIT USER CAN'T EDIT.....
      if(this.eTS1.submitDateTime != ''){
        this.readOnlySectionA = true;
        this.readOnlySectionB = true;
        this.readOnlySectionC = true;
        this.readOnlySectionD = true;
        this.readOnlySectionE = true;
        this.readOnlySectionF = true;
        this.readOnlySectionG = true;
        this.readOnlySectionH = true;
        this.readOnlySectionI = true;
      }      
    }
  }

  save(): void{
    // this.saveToLocal();
    // this.eTS1.ownerEmail = this.firestoreUserService.getFirestoreUser().email;
    this.eTS1Service.updateDateeTS1(this.eTS1);
    this.saveEvent.emit();

    Swal.fire(
      'Completed',
      'You saved this form',
      'success'
    );
  }

  instructorSubmit(): void {
    Swal.fire({
      title: "Do you want to submit this form?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        const timeStamp = this.datePipe.transform(new Date(), 'dd-MMM-yyyy HH:mm');
        this.eTS1.submitDateTime = timeStamp;

        this.save();
        this.reviseReadOnly();

        this.notiService.ETS1Notification(this.uuid,this.eTS1.ownerEmail);
        this.tabService.removeViewTab(this.uuid);
      }
    });
  }

  adminSubmit() : void {
    Swal.fire({
      title: "Do you want to finalize this form?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        const timeStamp = this.datePipe.transform(new Date(), 'dd-MMM-yyyy HH:mm');
        this.eTS1.completedDateTime = timeStamp;

        this.save();
        this.reviseReadOnly();

        this.sendToGoogle();
      }
    });    
  }

  sendToGoogle(): void {
    this.eTS1GoogleSheetService.post(this.eTS1)
    .subscribe(response => {
      if(response.toString().includes('TS1 form data has been uploaded to Training DATA studio.')){
        Swal.fire(
          'Completed',
          'You send this form to Big Data Completed',
          'success'
        );
      }
    });;
  }

  setDummy(): void{
    //SAVE INIT UUID, DRAFT TIME....
    Swal.fire({
      title: "Do you want to reset this form and fill with DUMMY data?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        //SAVE INIT UUID, DRAFT TIME....
        const tempUUID = this.eTS1.uuid;
        const tempInitTime = this.eTS1.initDateTime;

        //SET TO LOFT 2022....
        this.eTS1 = {...dummyETS1Data};
        this.eTS1.uuid = tempUUID;
        this.eTS1.initDateTime = tempInitTime;

        this.setName3();
        this.saveToLocal();
        
        this.saveEvent.emit();
      } else if (result.isDenied) {
        // resultB = false;
      }
    });
  }

  setLoftH22023() : void{
    // let resultB = false;
    Swal.fire({
      title: "Do you want to reset this form and fill with standard LOFT (JUL - DEC 2023)?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        //SAVE INIT UUID, DRAFT TIME....
        const tempUUID = this.eTS1.uuid;
        const tempInitTime = this.eTS1.initDateTime;
        const tempEmail = this.eTS1.ownerEmail;

        //SET TO LOFT 2022....
        this.eTS1 = {...loft2023H2ETS1Data};
        this.eTS1.uuid = tempUUID;
        this.eTS1.ownerEmail = tempEmail;
        this.eTS1.initDateTime = tempInitTime;

        this.setName3();
        this.saveToLocal();
        this.saveEvent.emit();
      } else if (result.isDenied) {
        // resultB = false;
      }
    });
  }

  setLoftH12023() : void{
    // let resultB = false;
    Swal.fire({
      title: "Do you want to reset this form and fill with standard LOFT (JAN - JUN 2023)?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        //SAVE INIT UUID, DRAFT TIME....
        const tempUUID = this.eTS1.uuid;
        const tempInitTime = this.eTS1.initDateTime;
        const tempEmail = this.eTS1.ownerEmail;

        //SET TO LOFT 2022....
        this.eTS1 = {...loft2023H1ETS1Data};
        this.eTS1.uuid = tempUUID;
        this.eTS1.ownerEmail = tempEmail;
        this.eTS1.initDateTime = tempInitTime;

        this.setName3();
        this.saveToLocal();
        this.saveEvent.emit();
      } else if (result.isDenied) {
        // resultB = false;
      }
    });
  }

  setCoftH22023() : void{
    Swal.fire({
      title: "Do you want to reset this form and fill with standard COFT (JUL - DEC 2023)?",
      showCancelButton: true,
      icon: 'warning',
      confirmButtonText: 'Yes'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        //SAVE INIT UUID, DRAFT TIME....
        const tempUUID = this.eTS1.uuid;
        const tempInitTime = this.eTS1.initDateTime;
        const tempEmail = this.eTS1.ownerEmail;

        //SET TO COFT 2022....
        this.eTS1 = {...coft2023H2ETS1Data};
        this.eTS1.uuid = tempUUID;
        this.eTS1.ownerEmail = tempEmail;
        this.eTS1.initDateTime = tempInitTime;

        this.setName3();
        this.saveToLocal();
        
        this.saveEvent.emit();
      } else if (result.isDenied) {
        // resultB = false;
      }
    });       
  }

  setCoftH12023() : void{
    Swal.fire({
      title: "Do you want to reset this form and fill with standard COFT (JAN - JUN 2023)?",
      showCancelButton: true,
      icon: 'warning',
      confirmButtonText: 'Yes'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        //SAVE INIT UUID, DRAFT TIME....
        const tempUUID = this.eTS1.uuid;
        const tempInitTime = this.eTS1.initDateTime;
        const tempEmail = this.eTS1.ownerEmail;

        //SET TO COFT 2022....
        this.eTS1 = {...coft2023H1ETS1Data};
        this.eTS1.uuid = tempUUID;
        this.eTS1.ownerEmail = tempEmail;
        this.eTS1.initDateTime = tempInitTime;

        this.setName3();
        this.saveToLocal();
        
        this.saveEvent.emit();
      } else if (result.isDenied) {
        // resultB = false;
      }
    });       
  }
  

  resetForm() : void{
    Swal.fire({
      title: "Do you want to reset this form?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        // if(!confirm("Do you want to reset this form?"))
        //   return;
        //SAVE INIT UUID, DRAFT TIME....
        const tempUUID = this.eTS1.uuid;
        const tempInitTime = this.eTS1.initDateTime;
        const tempEmail = this.eTS1.ownerEmail;
        
        //RESET TO CLEAN DATA....
        this.eTS1 = {...cleanETS1Data};
        this.eTS1.uuid = tempUUID;
        this.eTS1.ownerEmail = tempEmail;
        this.eTS1.initDateTime = tempInitTime;

        this.setName3();
        this.saveToLocal();
        
        this.saveEvent.emit();
      } else if (result.isDenied) {
        // resultB = false;
      }
    });
  }

  setName1(): void {
    if(!this.readOnlySectionA)
      this.eTS1.name1 = this.allStarService.getNameByStaffID(this.eTS1.staffNo1);
  }

  setName2(): void {
    if(!this.readOnlySectionA)
      this.eTS1.name2 = this.allStarService.getNameByStaffID(this.eTS1.staffNo2);
  }

  setName3(): void {
    if(this.eTS1.name3 == ''){
      this.eTS1.submitByEmail = this.firestoreUserService.getFirestoreUser().email;
      this.eTS1.name3 = this.allStarService.getNameByEmail(this.eTS1.submitByEmail);
    }
  }

  openRecommendedDialog(): void {
    // if(this.readOnlySectionH)
    //   return;
    // const dialogConfig = new MatDialogConfig();

    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.data = this.eTS1.signatureRecommended;
    
    // const dialogRef = this.dialog.open(SignatureDialogComponent,dialogConfig);
    // dialogRef.afterClosed().subscribe((result: string) => {this.eTS1.signatureRecommended = result;});
  }

  openInstructorDialog(): void {
    // if(this.readOnlySectionH)
    //   return;
    // const dialogConfig = new MatDialogConfig();

    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.data = this.eTS1.signatureInstructor;
        
    // const dialogRef = this.dialog.open(SignatureDialogComponent,dialogConfig);

    // dialogRef.afterClosed().subscribe((result: string) => {this.eTS1.signatureInstructor = result;});
  }

  openTraineeDialog(): void {
    // if(this.readOnlySectionH)
    //   return;
    // const dialogConfig = new MatDialogConfig();

    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.data = this.eTS1.signatureTrainee;

    // const dialogRef = this.dialog.open(SignatureDialogComponent,dialogConfig);

    // dialogRef.afterClosed().subscribe((result: string) => {this.eTS1.signatureTrainee = result;});
  }

  openStaff1Dialog(): void {
    // if(this.readOnlySectionI)
    //   return;
    // if(this.eTS1.formCompleted != 'true' && this.eTS1.copyCAAT != 'true')
    //   return;

    // const dialogConfig = new MatDialogConfig();

    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.data = this.eTS1.signatureStaff1;
    
    // const dialogRef = this.dialog.open(SignatureDialogComponent,dialogConfig);

    // dialogRef.afterClosed().subscribe((result: string) => {this.eTS1.signatureStaff1 = result;});
  }

  openStaff2Dialog(): void {
    // if(this.readOnlySectionI)
    //   return;
    // if(this.eTS1.validityDate != 'true' && this.eTS1.cmsUpdate != 'true')
    //   return;
      
    // const dialogConfig = new MatDialogConfig();

    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.data = this.eTS1.signatureStaff2;

    // const dialogRef = this.dialog.open(SignatureDialogComponent,dialogConfig);

    // dialogRef.afterClosed().subscribe((result: string) => {this.eTS1.signatureStaff2 = result;});
  }

  openStaff3Dialog(): void {
    // if(this.readOnlySectionI)
    //   return;
    // const dialogConfig = new MatDialogConfig();

    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.data = this.eTS1.signatureStaff3;
    
    // const dialogRef = this.dialog.open(SignatureDialogComponent,dialogConfig);

    // dialogRef.afterClosed().subscribe((result: string) => {this.eTS1.signatureStaff3 = result;});
  }

  revisedLicense(n: number): void{
    if(n == 1){
      if(this.license1No.invalid)
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          html: '<pre>Something went wrong!<br>PLEASE CHECK YOUR FORMAT LICENSE NUMBER <br>[1] B-XXXX <br>[2] D-XXXX <br>[3] TH.FCL.XXXXXXX</pre>'
        });
    }
    else
      if(this.license3No.invalid)
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          html: '<pre>Something went wrong!<br>PLEASE CHECK YOUR FORMAT LICENSE NUMBER <br>[1] B-XXXX <br>[2] D-XXXX <br>[3] TH.FCL.XXXXXXX</pre>'
        });

  }

  revisedAttemptNo() : void{
    if(this.isNaN(this.parseInt(this.eTS1.attemptNumber))){
      this.eTS1.attemptNumber = "N/A";
      return;
    }

    if(parseInt(this.eTS1.attemptNumber) < 1 )
      this.eTS1.attemptNumber = "N/A";
    else
      this.eTS1.attemptNumber = <string> this.parseInt(this.eTS1.attemptNumber,10);     
    
  }

  revisedIEC(){
    if(this.eTS1.instructor != 'true'){
      this.eTS1.iec1Score = "0";
      this.eTS1.iec2Score = "0";
      this.eTS1.iec3Score = "0";
      this.eTS1.iec4Score = "0";
      this.eTS1.iec5Score = "0";
    }
  } 

  revisedSectorsNo() : void{
    // if(this.eTS1.progress == 'false'){
    //   this.eTS1.attemptNumber = "";
    //   return;
    // }

    if(this.isNaN(this.parseInt(this.eTS1.sectorsNo))){
      this.eTS1.sectorsNo = "N/A";
      return;
    }

    if(parseInt(this.eTS1.sectorsNo) < 1 )
      this.eTS1.sectorsNo = "N/A";
    else
      this.eTS1.sectorsNo = <string> this.parseInt(this.eTS1.sectorsNo,10);     
    
  }

  revisedAccSectorsNO() : void{
    if(this.isNaN(this.parseInt(this.eTS1.accSectorsNO))){
      this.eTS1.accSectorsNO = "N/A";
      return;
    }

    if(parseInt(this.eTS1.accSectorsNO) < 1 )
      this.eTS1.accSectorsNO = "N/A";
    else
      this.eTS1.accSectorsNO = <string> this.parseInt(this.eTS1.accSectorsNO,10);     
  }

  revisedAQ() : void {
    if(this.eTS1.aq === 'false'){
      this.eTS1.aqDetail = "";
      this.eTS1.aqNarrative = "";
    }
  }

  revisedSpecialOps() : void {
    if(this.eTS1.specialOps === 'false'){
      this.eTS1.specialDetail = "";
    }
  }

  revisedInstructor() : void {
    this.eTS1.iec1Score = "";
    this.eTS1.iec2Score = "";
    this.eTS1.iec3Score = "";
    this.eTS1.iec4Score = "";
    this.eTS1.iec5Score = "";
    if(this.eTS1.instructor === 'false'){
      this.eTS1.instructorDetail = "";

      this.eTS1.gti = "";
      this.eTS1.sfi = "";
      this.eTS1.tri = "";
      this.eTS1.sfe = "";
      this.eTS1.tre = "";
    }
  }

  revisedSkillTest() : void{
    if(this.eTS1.skillTest === 'false'){
      this.eTS1.skillTestDetail = "";
    }
  }

  revisedRhs() : void{
    if(this.eTS1.rhs === 'false'){
      this.eTS1.rhsDetail = "";
    }
  }

  revisedOthers() : void {
    if(this.eTS1.others === 'false'){
      this.eTS1.othersDetail1 = "";
      this.eTS1.othersDetail2 = "";
      this.eTS1.othersDetail3 = "";
    }
  }

  isRankInstructorCorrect() : boolean{
    var x : number = 0;
    if(this.eTS1.gti === 'true')
      x++;
    if(this.eTS1.sfi === 'true')
      x++
    if(this.eTS1.tri === 'true')
      x++;
    if(this.eTS1.sfe === 'true')
      x++ 
    if(this.eTS1.tre === 'true')
      x++ 

    if(x == 1)
      return true;
    else
      return false;
  }

  clearRankInstructor() : void{
    this.eTS1.gti = 'false';
    this.eTS1.sfi = 'false';
    this.eTS1.tri = 'false';
    this.eTS1.sfe = 'false';
    this.eTS1.tre = 'false';
  }

  showAverage() : void{
    let score : number = 0;
    let index : number = 0;

    let myList : Array<string> = ["knoScore", "proScore", "fpmScore", "fpaScore", "comScore", "wlmScore",
                                 "psdScore", "ltwScore", "sawScore"
                                 ]                 
    type ObjectKey = keyof typeof this.eTS1;

    //Revised System Normal.....
    for(let i=0;i<myList.length;i++){
      if(this.eTS1[myList[i] as ObjectKey] != '0' &&  this.eTS1[myList[i] as ObjectKey] !='' ){
        score += this.parseInt(this.eTS1[myList[i] as ObjectKey]);
        index++;
      }
    }
    if(Math.round(score/index) != this.eTS1.overAllScore)
      Swal.fire(
        'The average score of section F. is ' + Math.round(score/index),
        'Overall grading is ' + this.eTS1.overAllScore,
        'question'
      );
    
  }

  isItFail() : boolean {
    let score1 : number = 0;
    let score2 : number = 0;

    let myList : Array<string> = ["preFlightPFScore", "startPFScore", "takeOffPFScore", "climbPFScore", "descendPFScore", "approachPFScore",
                                 "goAroundPFScore", "landingPFScore", "afterLandingPFScore", "parkingPFScore", "flightManagementPFScore", "specialOpsPFScore",
                                 "preFlightPMScore", "startPMScore", "takeOffPMScore", "climbPMScore", "descendPMScore", "approachPMScore",
                                 "goAroundPMScore", "landingPMScore", "afterLandingPMScore", "parkingPMScore", "flightManagementPMScore", "specialOpsPMScore"
                                 ]
                                
    type ObjectKey = keyof typeof this.eTS1;

    //Revised System Normal.....
    for(let i=0;i<myList.length;i++){
      if(this.eTS1[myList[i] as ObjectKey] == '1' || this.eTS1[myList[i] as ObjectKey] == ''){
        score1++;
      }
      if(this.eTS1[myList[i] as ObjectKey] == '2'){
        score2++;
      }
    }
    //alert('Score 1 : ' + score1);
    //alert('Score 2 : ' + score2);

    if(score1 >= 1)
      return true;
    if(score2 >= 5)
      return true;

    return false;
  }

  revisedSectionH() : void {
    if(this.eTS1.trainingCompleted != 'YES'){
      if(this.eTS1.objectMet == 'YES'){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          html: 'Training/Check Session didn\'t Completed. ' + 'Training/Check Objectives couldn\'t be S.'
        });
        //alert('Training/Check Session didn\'t Completed. ' + 'Training/Check Objectives couldn\'t be S.');
        this.eTS1.objectMet = '';
      }
      if(this.eTS1.clearCheck == 'YES'){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          html: 'Training/Check Session didn\'t Completed. ' + 'Cleared for check can\'t be YES'
        });
        //alert('Training/Check Session didn\'t Completed. ' + 'Cleared for check can\'t be YES');
        this.eTS1.clearCheck = '';
      }
    }

    if(this.eTS1.objectMet != 'YES'){
      if(this.eTS1.clearCheck == 'YES'){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          html: 'Training/Check Objectives didn\'t Met. ' + 'Cleared for check can\'t be YES'
        });
        //alert('Training/Check Objectives didn\'t Met. ' + 'Cleared for check can\'t be YES');
        this.eTS1.clearCheck = '';
      }
    }

    if(this.isItFail()){
      if(this.eTS1.objectMet == 'YES'){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          html: 'Section D didn\'t Passed. ' + 'Training/Check Objectives couldn\'t be S.'
        });
        //alert('Section D didn\'t Passed. ' + 'Training/Check Objectives couldn\'t be S.');
        this.eTS1.objectMet = '';
      }
      if(this.eTS1.clearCheck == 'YES'){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          html: 'Section D didn\'t Passed. ' + 'Cleared for check can\'t be YES'
        });
        //alert('Section D didn\'t Passed. ' + 'Cleared for check can\'t be YES');
        this.eTS1.clearCheck = '';
      }
    }
  }

  setRankInstructor(rank : string , result : boolean) : void{
    this.clearRankInstructor();
    if(rank == "GTI")
      this.eTS1.gti = result ? 'true' : 'false';

    if(rank == "SFI")
      this.eTS1.sfi = result ? 'true' : 'false';

    if(rank == "TRI")
      this.eTS1.tri = result ? 'true' : 'false';

    if(rank == "SFE")
      this.eTS1.sfe = result ? 'true' : 'false';

    if(rank == "TRE")
      this.eTS1.tre = result ? 'true' : 'false';

  }

  clearRecommened() : void{
    this.eTS1.cmdRecommended = 'false';
    this.eTS1.gtiRecommended = 'false';
    this.eTS1.triRecommended = 'false';
    this.eTS1.treRecommended = 'false';
    this.eTS1.othersRecommended = 'false';
  }

  setRecommended(rank : string , result : boolean) : void{
    this.clearRecommened();
    if(rank == "CMD")
      this.eTS1.cmdRecommended = result ? 'true' : 'false';

    if(rank == "GTI")
      this.eTS1.gtiRecommended = result ? 'true' : 'false';

    if(rank == "TRI")
      this.eTS1.triRecommended = result ? 'true' : 'false';

    if(rank == "TRE")
      this.eTS1.treRecommended = result ? 'true' : 'false';

    if(rank == "OTHER")
      this.eTS1.othersRecommended = result ? 'true' : 'false';
  }

  revisedOthersRecommended():void{
    if(this.eTS1.othersRecommended == 'false'){
      this.eTS1.othersRecommendedDetail = '';
    }
  }

  revisedFbs(): void {
    if(this.eTS1.fbs === 'false'){
      this.eTS1.fbsDetail = "";
    }
  }

  revisedFfs(): void {
    if(this.eTS1.ffs === 'false'){
      this.eTS1.ffsDetail = "";
    }
  }

  revisedIlc(): void {
    if(this.eTS1.ilc === 'false'){
      this.eTS1.ilcDetail = "";
    }
  }

  revisedProgress(): void {
    if(this.eTS1.progress === 'false'){
      this.eTS1.progressDetail = "";
      this.eTS1.attemptNumber = "N/A";
    }
    else{
      this.eTS1.attemptNumber = "";
    }
  }

  revisedZftt(): void {
    if(this.eTS1.zftt === 'false'){
      this.eTS1.zfttDetail = "";
    }
  }
  
  revisedSectionE() : void {
    let systemNormals : Array<string> = [];
    let systemNormalScores : Array<string> = [];

    let systemAbNormals : Array<string> = [];
    let systemAbNormalScores : Array<string> = [];

    type ObjectKey = keyof typeof this.eTS1;

    //Revised System Normal.....
    for(let i=1;i<=6;i++){
      if(this.eTS1['system' + i + 'Detail' as ObjectKey] != ''){
        systemNormals.push(this.eTS1["system" + i + "Detail" as ObjectKey]);
        systemNormalScores.push(this.eTS1['system' + i + 'Score' as ObjectKey]);
      }
    }

    for(let i=1;i<=systemNormals.length;i++){
      this.eTS1["system" + i + "Detail" as ObjectKey] = systemNormals[i-1];
      this.eTS1["system" + i + "Score" as ObjectKey] = systemNormalScores[i-1];
    }

    for(let i=systemNormals.length + 1;i<=6;i++){
      this.eTS1["system" + i + "Detail" as ObjectKey] = "";
      this.eTS1["system" + i + "Score" as ObjectKey] = "";
    }

    //Revised Abnormal.....
    for(let i=1;i<=6;i++){
      if(this.eTS1['abNormal' + i + 'Detail' as ObjectKey] != ''){
        //console.log('push : ' + i + this.eTS1['abNormal' + i + 'Detail' as ObjectKey]);
        systemAbNormals.push(this.eTS1["abNormal" + i + "Detail" as ObjectKey]);
        systemAbNormalScores.push(this.eTS1['abNormal' + i + 'Score' as ObjectKey]);
      }
    }

    for(let i=1;i<=systemAbNormals.length;i++){
      this.eTS1["abNormal" + i + "Detail" as ObjectKey] = systemAbNormals[i-1];
      this.eTS1["abNormal" + i + "Score" as ObjectKey] = systemAbNormalScores[i-1];
    }

    for(let i=systemAbNormals.length + 1;i<=6;i++){
      this.eTS1["abNormal" + i + "Detail" as ObjectKey] = "";
      this.eTS1["abNormal" + i + "Score" as ObjectKey] = "";
    }
  
    if(this.eTS1.system1Detail == '')
      this.eTS1.system1Score = '';
    if(this.eTS1.system2Detail == '')
      this.eTS1.system2Score = '';
    if(this.eTS1.system3Detail == '')
      this.eTS1.system3Score = '';
    if(this.eTS1.system4Detail == '')
      this.eTS1.system4Score = '';
    if(this.eTS1.system5Detail == '')
      this.eTS1.system5Score = '';
    if(this.eTS1.system6Detail == '')
      this.eTS1.system6Score = '';

    if(this.eTS1.abNormal1Detail == '')
      this.eTS1.abNormal1Score = '';
    if(this.eTS1.abNormal2Detail == '')
      this.eTS1.abNormal2Score = '';
    if(this.eTS1.abNormal3Detail == '')
      this.eTS1.abNormal3Score = '';
    if(this.eTS1.abNormal4Detail == '')
      this.eTS1.abNormal4Score = '';
    if(this.eTS1.abNormal5Detail == '')
      this.eTS1.abNormal5Score = '';
    if(this.eTS1.abNormal6Detail == '')
      this.eTS1.abNormal6Score = '';
  }

  revisedSectionG() : void {
    let tempDEScores : any[] = [];
    let tempPCScores : any[] = [];
    let tempIECScores : any[] = [];
    let tempNOTEScores : any[] = [];
    for( let i=0 ; i < this.eTS1.noteDetails.length; i++ ){
      if(this.eTS1.noteDetails[i] !== ''){
        tempDEScores.push(this.eTS1.deScores[i]);
        tempPCScores.push(this.eTS1.pcScores[i]);
        tempIECScores.push(this.eTS1.iecScores[i]);
        tempNOTEScores.push(this.eTS1.noteDetails[i]);
      }
    }

    for( let i=0; i < tempNOTEScores.length ; i++){
      this.eTS1.deScores[i] = tempDEScores[i];
      this.eTS1.pcScores[i] = tempPCScores[i];
      this.eTS1.iecScores[i] = tempIECScores[i];
      this.eTS1.noteDetails[i] = tempNOTEScores[i];
    }

    for( let i=tempNOTEScores.length ; i < this.eTS1.noteDetails.length ; i++){
      this.eTS1.deScores[i] = "";
      this.eTS1.pcScores[i] = "";
      this.eTS1.iecScores[i] = "";
      this.eTS1.noteDetails[i] = "";
    }
  }
}
