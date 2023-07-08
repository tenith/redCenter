import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrewDetail } from '../../../@core/shared/interfaces/crew-detail';
import { FlightDetail } from '../../../@core/shared/interfaces/flight-detail';

import { vrPosOptions } from '../../../../environments/myconfigs';
import { registration } from '../../../../environments/myconfigs';
import { Subscription } from 'rxjs';

import * as uuid from 'uuid';

import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { SignatureDialogComponent } from '../signature-dialog/signature-dialog.component';
import { VrService } from '../../../@core/shared/services/vr.service';
import { VrDetail, defaultVR } from '../../../@core/shared/interfaces/vr-detail';
import { FirestoreUserService } from '../../../@core/shared/services/firestore-user.service';
import { ActivatedRoute } from '@angular/router';
import { VrListconfirmationComponent } from '../vr-listconfirmation/vr-listconfirmation.component';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { debounceTime } from 'rxjs/operators';

import { localStorageCollection } from '../../../../environments/myconfigs';
import { TinyMCEComponent } from '../../../@theme/components';
import { QrCodeComponent } from '../qr-code/qr-code.component';
import { CommentDetail } from '../../../@core/shared/interfaces/comment';
import { VRCommentGoogleSheetsSerivce } from '../../../@core/shared/services/vrCommentGoogleSheets.service';
import { VrNotificationService } from '../../../@core/shared/services/vrNotification.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit, AfterViewInit, OnDestroy {
  form: FormGroup;

  totalComments: number = 5;

  registrations = registration;
  vrPostOptions = vrPosOptions;
  crewList: CrewDetail[] = [];
  flightList: FlightDetail[] = [];
  commentList: CommentDetail[] = [];

  saveFormSub: Subscription;

  dialogRef: NbDialogRef<DeleteConfirmationComponent>;
  signatureRef: NbDialogRef<SignatureDialogComponent>;
  qrRef: NbDialogRef<QrCodeComponent>;

  myDutyTime: string;
  maxDutyTime: string;

  hExtended: string;
  mExtended: string;

  extended: boolean = false;
  readOnly: boolean = false;

  vr: VrDetail;
  canReset: boolean = false;

  android: boolean = true;
  submitStatus: boolean = false;

  @ViewChild('page1', { static: false }) public p1: ElementRef;
  @ViewChild('page2', { static: false }) public p2: ElementRef;

  @ViewChild(TinyMCEComponent) tinymceComponent: TinyMCEComponent;

  constructor(private vrNotificationService: VrNotificationService, private toastr: NbToastrService, private vrCommentService: VRCommentGoogleSheetsSerivce, private route: ActivatedRoute, private changeDetectorRefs: ChangeDetectorRef,private firestoreUser:FirestoreUserService, private vrService:VrService, private formBuilder: FormBuilder, private dialogService: NbDialogService) { }

  ngOnDestroy(): void {
    this.saveFormSub.unsubscribe();
  }

  ngOnInit(): void {
    this.android = navigator.userAgent.indexOf('Android') != -1; 
    this.softReset();

    //LOAD FROM FIRESTORE....
    const tempId = this.route.snapshot.queryParamMap.get('id');
    if(tempId != null){
      this.vrService.getVR(tempId).then(doc => { 
        this.vr = doc.data(); 
        this.loadVR();
      });      
    }
    else{
      const savedVR = localStorage.getItem(localStorageCollection.vrLocalDBNameCollectionName);
      if(savedVR != null){
        this.vr = {...JSON.parse(savedVR) as VrDetail};
        this.loadVR();

        console.log(this.vr.submitTime);
      }
      else{
        this.vr = {...defaultVR};
        this.loadVR();
      }
    }
  }

  ngAfterViewInit(): void {
  }

  loadVR(): void {
    this.softReset();
    this.crewList = [...this.vr.crews];
    this.flightList = [...this.vr.flights];
    this.commentList = [...this.vr.comments];

    this.form.get('uuid').setValue(this.vr.uuid);
    this.form.get('date').setValue(this.vr.date);

    this.form.get('extendedSignature').setValue(this.vr.extendedSignature);
    this.form.get('extendedTime').setValue(this.vr.extendedTime);
    this.form.get('vrSignature').setValue(this.vr.vrSignature);
    this.form.get('comment').setValue(this.vr.comment);
    
    if(this.vr.submitTime != '' && this.vr.submitTime != undefined)
      this.submitStatus = true;
    else  
      this.submitStatus = false;

    this.loadCrews();
    this.loadFlights();
    this.loadComments();
    
    this.myDutyTime = this.calMyDuty();
    this.maxDutyTime = this.maxDuty();
    this.isExtended();

    this.finalForm();
  }

  noCrews(): boolean {
    if(this.getFormArrayByName('crews').length == 0){
      return true;
    }

    return false;
  }

  noCrewsFlights(): boolean {
    if(this.getFormArrayByName('crews').length == 0 || this.getFormArrayByName('flights').length == 0){
      return true;
    }

    return false;
  }

  isExtended(): void {
    if(this.noCrewsFlights())
      return;
    
    if(this.isGreater(this.myDutyTime,this.maxDutyTime)){
      this.extended = true;
      this.form.get('extendedSignature').setValidators([Validators.required]);
    }
    else {
      this.form.get('extendedSignature').clearValidators();
      this.extended = false;
    }

    const temp = this.subtractTime(this.myDutyTime,this.maxDutyTime);
    this.hExtended = temp.split(':')[0];
    this.mExtended = temp.split(':')[1];
  }

  saveForm(): void {
    // console.log('saveform: ' + JSON.stringify(this.form.value));
    localStorage.setItem(localStorageCollection.vrLocalDBNameCollectionName, JSON.stringify(this.form.value));
  }

  saveVR(): void {
    localStorage.setItem(localStorageCollection.vrLocalDBNameCollectionName, JSON.stringify(this.vr));
  }

  qr(): void {
    let vr: VrDetail = this.prepareData();
    console.log('qr data: ' + JSON.stringify(vr));    
    this.qrRef = this.dialogService.open(QrCodeComponent,{
      context: {
        data: JSON.stringify(vr)
      }
    });
    
    this.qrRef.onClose.subscribe(confirm => {});
  }

  calMyDuty(): string {
    if(this.noCrewsFlights()){
      return '00:00';
    }
      
    const myReportTime = this.getFormArrayByName('crews').at(0).value.report;
    const numberOfLanding = this.getFormArrayByName('flights').length;
    if(numberOfLanding == 0)
      return '00:00';

    const landingTime = this.getFormArrayByName('flights').at(numberOfLanding - 1).value.onChk;
    const dutyEnd = this.addTime(landingTime,'00:30');

    return this.subtractTime(dutyEnd,myReportTime);
  }

  maxDuty(): string {
    let fdp: any = [
      {start:'23:00',stop:'00:59',duty:['13:00','12:15','11:45','11:15','10:45','09:45','09:00','09:00']},
      {start:'01:00',stop:'07:59',duty:['13:30','13:15','12:30','11:45','11:15','10:45','09:30','09:00']},
      {start:'08:00',stop:'14:59',duty:['13:00','12:15','11:30','10:45','10:00','09:15','09:00','09:00']},
      {start:'15:00',stop:'22:59',duty:['11:00','10:15','09:30','09:00','09:00','09:00','09:00','09:00']},
    ];

    if(this.crewList.length <= 0)
      return;
    
    const myReportTime = this.getFormArrayByName('crews').at(0).value.report;
    let numberOfLanding = this.getFormArrayByName('flights').length;
    const standardDepartureTime = this.addTime(myReportTime,"01:00");
    if(numberOfLanding == 0)
      return '00:00';

    if(numberOfLanding >= 8)
      numberOfLanding = 8;

    for(let i=0;i<fdp.length;i++){
      const startTime = this.addTime(fdp[i].start,"01:00");
      const stopTime = this.addTime(fdp[i].stop,"01:00");

      const myTime = this.addTime(standardDepartureTime,"01:00");
      if(this.isGreater(stopTime,myTime) && this.isGreater(myTime,startTime))
          return fdp[i].duty[numberOfLanding-1];
    }

    return '00:00';
  }

  getFormArrayByName(name: string): FormArray {
    return this.form.get(name) as FormArray;
  }

  
  loadComments(): void {
    let commentGroup = this.getFormArrayByName('comments') as FormArray;
    commentGroup.clear();

    this.addComments(this.commentList);
  }

  addComments(commentList: CommentDetail[]): void {   

    let commentGroup = this.getFormArrayByName('comments') as FormArray;
    for(let i=0;i<this.totalComments;i++){
      let commentFormGroup: FormGroup;
      if(commentList.length >= i + 1){
        commentFormGroup = this.formBuilder.group({
          flightNumber: [commentList[i].flightNumber],
          area: [commentList[i].area],
          phaseOfFlight: [commentList[i].phaseOfFlight],
          areaOfComment: [commentList[i].areaOfComment],
          detail: [commentList[i].detail]
        });
      }
      else {
        commentFormGroup = this.formBuilder.group({
          flightNumber: [''],
          area: ['-' ],
          phaseOfFlight: [''],
          areaOfComment: [''],
          detail: ['-']
        });
      }
    
      // console.log('index: ' + i + " , " + (commentFormGroup === blankCommentForm));
      commentFormGroup.valueChanges.subscribe(value=>{this.reviseComments();});
      commentGroup.push(commentFormGroup);
    }
  }

  reviseComments(): void {
    let commentGroup = this.getFormArrayByName('comments') as FormArray;
    
    for(let i=0;i<commentGroup.length;i++){      
      const detail = commentGroup.at(i).get('detail').value;    
      console.log('index: ' + i + " , " + (detail == '-'));  
      if(detail == '-'){
        commentGroup.at(i).get('flightNumber').clearValidators();
        commentGroup.at(i).get('area').clearValidators();
        commentGroup.at(i).get('phaseOfFlight').clearValidators();
        commentGroup.at(i).get('areaOfComment').clearValidators();     

        commentGroup.at(i).get('flightNumber').setValue('', { emitEvent: false });
        commentGroup.at(i).get('area').setValue('-', { emitEvent: false });
        commentGroup.at(i).get('phaseOfFlight').setValue('', { emitEvent: false });
        commentGroup.at(i).get('areaOfComment').setValue('', { emitEvent: false });

        // commentGroup.at(i).get('detail').setValue('-', { emitEvent: false });

        commentGroup.at(i).get('flightNumber').updateValueAndValidity({ emitEvent: false });
        commentGroup.at(i).get('area').updateValueAndValidity({ emitEvent: false });
        commentGroup.at(i).get('phaseOfFlight').updateValueAndValidity({ emitEvent: false });
        commentGroup.at(i).get('areaOfComment').updateValueAndValidity({ emitEvent: false });   
      }
      else{
        console.log('set validator: ' + i);
        commentGroup.at(i).get('flightNumber').setValidators([Validators.required]);
        commentGroup.at(i).get('area').setValidators([Validators.required]);
        commentGroup.at(i).get('phaseOfFlight').setValidators([Validators.required]);
        commentGroup.at(i).get('areaOfComment').setValidators([Validators.required]);

        commentGroup.at(i).get('flightNumber').updateValueAndValidity({ emitEvent: false });
        commentGroup.at(i).get('area').updateValueAndValidity({ emitEvent: false });
        commentGroup.at(i).get('phaseOfFlight').updateValueAndValidity({ emitEvent: false });
        commentGroup.at(i).get('areaOfComment').updateValueAndValidity({ emitEvent: false });
      }
    }

    this.changeDetectorRefs.detectChanges();
  }

  limitLines(event: any) {
    const textarea = event.target;
    const lines = textarea.value.split('\n');

    if (lines.length > 3) {
      textarea.value = lines.slice(0, 4).join('\n'); // Only keep the first 3 lines
    }
  }

  loadCrews(): void {
    let crewGroup = this.getFormArrayByName('crews') as FormArray;
    crewGroup.clear();   

    this.canReset = false;
    for(let i=0;i<this.crewList.length;i++){
      if(this.firestoreUser.getFirestoreUser().cId == this.crewList[i].id)
        this.canReset = true;
      this.addCrew(this.crewList[i]);
    }
  }

  loadFlights(): void {
    let flightGroup = this.getFormArrayByName('flights') as FormArray;
    flightGroup.clear();

    for(let i=0;i<this.flightList.length;i++)
      this.addFlight(this.flightList[i]);
  }

  addCrew(crewDetail: CrewDetail): void {
    const newCrewForm = this.formBuilder.group({
      id: [crewDetail.id, [Validators.required, Validators.pattern("1[0-9]{6}$")]],
      position: [crewDetail.position, Validators.required],
      name: [crewDetail.name, Validators.required],
      report: [crewDetail.report, Validators.required]
    });

    let crewGroup = this.getFormArrayByName('crews') as FormArray;
    crewGroup.push(newCrewForm);

    newCrewForm.valueChanges.subscribe(value=>{
      this.reviseCrew();
    });
  }

  reviseCrew(): void {
    this.crewList = [];
    let crewGroup = this.getFormArrayByName('crews') as FormArray;
    
    for(let i=0;i<crewGroup.length;i++){
      this.crewList.push({...crewGroup.at(i).value as unknown as CrewDetail});
    }

    this.changeDetectorRefs.detectChanges();
  }

  async myPrint(): Promise<void>{    
    let pdf = new jsPDF('p', 'px', 'a4', true);
    const p1C = this.p1.nativeElement;    
    const p2C = this.p2.nativeElement;     
    
    //SAVE PAGE1....
    await html2canvas(p1C, { useCORS: true, scale: 2, allowTaint: true , logging: true, } ).then((canvas) => {
      const offset = 15;
      const tableWidth = p1C.offsetWidth;
      const tableHeight = p1C.offsetHeight;       

      // Set the maximum width of the PDF page
      const maxWidth = pdf.internal.pageSize.getWidth() - offset*2;

      // Calculate the scale ratio based on the table width and maximum PDF page width
      const scaleRatio = maxWidth / tableWidth;

      // Calculate the scaled table width and height
      const scaledWidth = tableWidth * scaleRatio;
      const scaledHeight = tableHeight * scaleRatio;

      // Convert the canvas to an image data URL with the scaled dimensions
      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', offset, offset, scaledWidth, scaledHeight);
    }); 

    //SAVE PAGE2....
    await html2canvas(p2C, { useCORS: true, scale: 2, allowTaint: true , logging: true,  } ).then((canvas) => {
      const offset = 15;
      const tableWidth = p2C.offsetWidth;
      const tableHeight = p2C.offsetHeight;       

      // Set the maximum width of the PDF page
      const maxWidth = pdf.internal.pageSize.getWidth() - offset*2;
      const maxHeight = pdf.internal.pageSize.getHeight() - offset*2;

      // Calculate the scale ratio based on the table width and maximum PDF page width
      const scaleRatio = maxHeight / tableHeight;

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

  canSign(): boolean {
    return Object.keys(this.form.controls)
      .filter(controlName => controlName !== 'vrSignature')
      .every(controlName => this.form.controls[controlName].valid);
  }

  removeCrew(index: number): void {
    let crewGroup = this.getFormArrayByName('crews') as FormArray;
    crewGroup.removeAt(index);
  }

  edit(event: any): void{
    if(this.form.value.comment == (event as string))
      return;
    
    this.form.get('comment').setValue(event as string);
  }

  newCrew(): void{
    let crewDetail: CrewDetail = {
      id: '',
      position: '',
      name: '',
      report: ''
    };

    this.addCrew(crewDetail);

    this.myDutyTime = this.calMyDuty();
    this.maxDutyTime = this.maxDuty();
    this.isExtended();
  }

  newFlight(): void{
    if(this.noCrews())
      return;

    let flightDetail: FlightDetail = {
      fltNO: '',
      registration: '',
      from: '',
      to: '',
      std: '00:00',
      sta: '00:00',
      blk: '00:00',
      offChk: '00:00',
      takeOff: '00:00',
      landing: '00:00',
      onChk: '00:00',
      actBlk: '00:00',
      PFId: '',
      uplift: '',
      burn: '',
      departureDelayTime1: '00:00',
      departureDelayCode1: '-',
      departureDelayTime2: '00:00',
      departureDelayCode2: '-',
      departureDelayTime3: '00:00',
      departureDelayCode3: '-',
      arrivalDelayTime1: '00:00',
      arrivalDelayCode1: '-'
    };

    this.addFlight(flightDetail);
  }

  addFlight(flightDetail: FlightDetail): void {
    const newFlightForm = this.formBuilder.group({
      fltNO: [flightDetail.fltNO, [Validators.required, Validators.pattern("[0-9]{1,4}[a-zA-Z]?$")]],
      registration: [flightDetail.registration, [Validators.required, Validators.pattern("^[hH]{1}[sS]{1}-[a-zA-Z]{3}$") ]],
      from: [flightDetail.from, [Validators.required, Validators.pattern('^[a-zA-Z]{3}$') ]],
      to: [flightDetail.to, [Validators.required, Validators.pattern('^[a-zA-Z]{3}$') ]],

      std: [flightDetail.std, [Validators.required]],
      sta: [flightDetail.sta, Validators.required],
      blk: [this.subtractTime(flightDetail.sta, flightDetail.std), Validators.required],

      offChk: [flightDetail.std, Validators.required],
      takeOff: [this.addTime(flightDetail.std,'00:10'), [Validators.required]],
      landing: [this.subtractTime(flightDetail.sta,'00:10'), Validators.required],
      onChk: [flightDetail.sta, Validators.required],
      actBlk: [this.subtractTime(flightDetail.sta,flightDetail.std), Validators.required],

      PFId: [flightDetail.PFId, [Validators.required,Validators.pattern("1[0-9]{6}$")]],

      uplift: [flightDetail.uplift, Validators.required],
      burn: [flightDetail.burn, Validators.required],

      departureDelayTime1: [flightDetail.departureDelayTime1 == "" ? "00:00" : flightDetail.departureDelayTime1],
      departureDelayCode1: [flightDetail.departureDelayCode1 == "" ? "-" : flightDetail.departureDelayCode1],

      departureDelayTime2: [flightDetail.departureDelayTime2 == "" ? "00:00" : flightDetail.departureDelayTime2],
      departureDelayCode2: [flightDetail.departureDelayCode2 == "" ? "-" : flightDetail.departureDelayCode2],

      departureDelayTime3: [flightDetail.departureDelayTime3 == "" ? "00:00" : flightDetail.departureDelayTime3],
      departureDelayCode3: [flightDetail.departureDelayCode3 == "" ? "-" : flightDetail.departureDelayCode3],

      arrivalDelayTime1: [flightDetail.arrivalDelayTime1 == "" ? "00:00" : flightDetail.arrivalDelayTime1],
      arrivalDelayCode1: [flightDetail.arrivalDelayCode1 == "" ? "-" : flightDetail.arrivalDelayCode1],
    });
  
    newFlightForm.valueChanges.subscribe(value=>{
      this.reCalcBlk();

      this.myDutyTime = this.calMyDuty();
      this.maxDutyTime = this.maxDuty();
      this.isExtended();
    });

    let flightGroup = this.getFormArrayByName('flights') as FormArray;
    flightGroup.push(newFlightForm);

    this.myDutyTime = this.calMyDuty();
    this.maxDutyTime = this.maxDuty();
    this.isExtended();
  }

  reCalcBlk(): void {
    let flightGroup = this.getFormArrayByName('flights') as FormArray;

    for(let i=0;i<flightGroup.length;i++){
      const temp = flightGroup.at(i);     
      
      flightGroup.at(i).get('blk').setValue(this.subtractTime(temp.value.sta,temp.value.std), { emitEvent: false });
      flightGroup.at(i).get('actBlk').setValue(this.subtractTime(temp.value.onChk,temp.value.offChk), { emitEvent: false });

      flightGroup.at(i).get('arrivalDelayTime1').setValue(this.subtractDelay(temp.value.onChk,temp.value.sta), { emitEvent: false });

      let totalDepartureDelayTime = this.subtractDelay(temp.value.offChk,temp.value.std);

      for(let j=0;j<3;j++){
        if(totalDepartureDelayTime == '00:00'){
          flightGroup.at(i).get('departureDelayTime'+String(j+1)).setValue('00:00', { emitEvent: false });
        }

        if(this.isGreater(flightGroup.at(i).get('departureDelayTime'+String(j+1)).value,totalDepartureDelayTime)){
          flightGroup.at(i).get('departureDelayTime'+String(j+1)).setValue(totalDepartureDelayTime, { emitEvent: false });
          totalDepartureDelayTime = '00:00';
          continue;
        }

        if(this.isGreater(totalDepartureDelayTime, flightGroup.at(i).get('departureDelayTime'+String(j+1)).value)){
          totalDepartureDelayTime = this.subtractDelay(totalDepartureDelayTime,flightGroup.at(i).get('departureDelayTime'+String(j+1)).value);
        }

        if(flightGroup.at(i).get('departureDelayTime'+String(j+1)).value == '00:00' || j == 2){
          flightGroup.at(i).get('departureDelayTime'+String(j+1)).setValue(totalDepartureDelayTime, { emitEvent: false });
          break;
        }
      }

      for(let j=0;j<3;j++){
        if(flightGroup.at(i).get('departureDelayTime'+String(j+1)).value == '00:00'){
          flightGroup.at(i).get('departureDelayCode'+String(j+1)).clearValidators();
          flightGroup.at(i).get('departureDelayCode'+String(j+1)).setValue('-',{ emitEvent: false });
          flightGroup.at(i).get('departureDelayCode'+String(j+1)).updateValueAndValidity({ emitEvent: false });
        }
        else{
          if(flightGroup.at(i).get('departureDelayCode'+String(j+1)).value == '-')
            flightGroup.at(i).get('departureDelayCode'+String(j+1)).setValue('',{ emitEvent: false });
          flightGroup.at(i).get('departureDelayCode'+String(j+1)).setValidators([Validators.required]);
          flightGroup.at(i).get('departureDelayCode'+String(j+1)).updateValueAndValidity({ emitEvent: false });
        }
      }

      if(flightGroup.at(i).get('arrivalDelayTime1').value == '00:00'){
        flightGroup.at(i).get('arrivalDelayCode1').clearValidators();
        // flightGroup.at(i).get('arrivalDelayCode1').setValue('-',{ emitEvent: false });
        flightGroup.at(i).get('arrivalDelayCode1').updateValueAndValidity({ emitEvent: false });
      }
      else{
        if(flightGroup.at(i).get('arrivalDelayCode1').value == '-')
            flightGroup.at(i).get('arrivalDelayCode1').setValue('',{ emitEvent: false });
        flightGroup.at(i).get('arrivalDelayCode1').setValidators([Validators.required]);
        flightGroup.at(i).get('arrivalDelayCode1').updateValueAndValidity({ emitEvent: false });
      }
    }
  }

  removeFlight(index: number): void {
    let flightGroup = this.getFormArrayByName('flights') as FormArray;
    flightGroup.removeAt(index);

    this.reCalcBlk();

    this.myDutyTime = this.calMyDuty();
    this.maxDutyTime = this.maxDuty();
    this.isExtended();

  }

  isRequired(name: string): boolean {
    return this.form.get(name).hasValidator(Validators.required);
  }

  private isGreater(a: string, b: string): boolean {
    const [ahours, amins] = a.split(':').map(Number);
    const [bhours, bmins] = b.split(':').map(Number);

    const atotal = ahours * 60 + amins;
    const btotal = bhours * 60 + bmins;

    return atotal >= btotal;
  }

  openSignaturePad(name: string): void {
    this.signatureRef = this.dialogService.open(SignatureDialogComponent,{
      context: {
        data: this.form.get(name).value,
      },
      autoFocus: true,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: false
    });
    
    this.signatureRef.onClose.subscribe(confirm => {
      if(confirm != ''){
        this.form.get(name).setValue(confirm, { emitEvent: false });
        this.finalForm();        
      }
    });
  }

  finalForm(): void {
    this.saveForm();
    if(this.form.get('vrSignature').value != ''){
      this.readOnly = true;
    }
    else{ 
      this.form.enable();
      this.readOnly = false;
    }
  }

  confirmDeleteCrew(index: number): void {
    this.dialogRef = this.dialogService.open(DeleteConfirmationComponent,{
      context: {
        data: {
          title: 'Do you want to delete information?',
          information: 'You try to delete crew #' + (index + 1) + ' from this VR.'
        }
      }
    });
    
    this.dialogRef.onClose.subscribe(confirm => {
      if(confirm == 'affirm')
        this.removeCrew(index);
    });
  }

  confirmDeleteFlight(index: number): void {
    this.dialogRef = this.dialogService.open(DeleteConfirmationComponent,{
      context: {
        data: {
          title: 'Do you want to delete information?',
          information: 'You try to delete flight #' + (index + 1) + ' from this VR.'
        }
      }
    });
    
    this.dialogRef.onClose.subscribe(confirm => {
      if(confirm == 'affirm')
        this.removeFlight(index);
    });
  }

  private addTime(a: string, b: string): string {
    const [ahours, amins] = a.split(':').map(Number);
    const [bhours, bmins] = b.split(':').map(Number);

    const atotal = ahours * 60 + amins;
    const btotal = bhours * 60 + bmins;

    let resulttotal = atotal + btotal;
    if(resulttotal >= 1440)
      resulttotal -= 1440;

    const rhours = Math.floor(resulttotal / 60); 
    const rmins = resulttotal % 60; 

    const formattedHours = String(rhours).padStart(2, '0');
    const formattedMins = String(rmins).padStart(2, '0');

    return `${formattedHours}:${formattedMins}`;
  }

  private subtractDelay(a: string, b: string): string {
    const [ahours, amins] = a.split(':').map(Number);
    const [bhours, bmins] = b.split(':').map(Number);

    const atotal = ahours * 60 + amins;
    const btotal = bhours * 60 + bmins;

    let resulttotal = atotal - btotal;
    if(resulttotal < 0)
      return '00:00';

    const rhours = Math.floor(resulttotal / 60); 
    const rmins = resulttotal % 60; 

    const formattedHours = String(rhours).padStart(2, '0');
    const formattedMins = String(rmins).padStart(2, '0');

    return `${formattedHours}:${formattedMins}`;
  }

  private subtractTime(a: string, b: string): string {
    const [ahours, amins] = a.split(':').map(Number);
    const [bhours, bmins] = b.split(':').map(Number);

    const atotal = ahours * 60 + amins;
    const btotal = bhours * 60 + bmins;

    let resulttotal = atotal - btotal;
    if(resulttotal < 0)
      resulttotal += 1440;

    const rhours = Math.floor(resulttotal / 60); 
    const rmins = resulttotal % 60; 

    const formattedHours = String(rhours).padStart(2, '0');
    const formattedMins = String(rmins).padStart(2, '0');

    return `${formattedHours}:${formattedMins}`;
  }

  softReset() : void {
    this.form = this.formBuilder.group({
      uuid: [uuid.v4(), ],
      date: ['', [Validators.required,]],
      endorsement: [false, [Validators.required,]],
      ferry: [false, [Validators.required,]],
      training: [false, [Validators.required,]],
      testFlt: [false, [Validators.required,]],
      revenue: [true, [Validators.required,]],
      charter: [false, [Validators.required,]],
      crewsId: this.formBuilder.array([]),
      crews: this.formBuilder.array([]),
      flights: this.formBuilder.array([]),
      comments: this.formBuilder.array([]),
      extendedTime: [''],
      comment: [''],
      extendedSignature: ['', ],
      vrSignature: ['', [Validators.required,]],
    });

    this.readOnly = false;

    this.saveFormSub = this.form.valueChanges.pipe(debounceTime(2000))
    .subscribe(value=>{ this.saveForm(); });
    this.myDutyTime = '00:00';
    this.maxDutyTime = '00:00';

    this.crewList = [];
    this.flightList = [];
  }

  async init(): Promise<void> {
    const myDialogRef = this.dialogService.open(VrListconfirmationComponent);
    
    myDialogRef.onClose.subscribe(confirm => {
      if(confirm != ''){
        this.vr = JSON.parse(confirm) as VrDetail;
        this.loadVR();        
      }
    });
  }

  reset(): void {

    this.dialogRef = this.dialogService.open(DeleteConfirmationComponent,{
      context: {
        data: {
          title: 'Do you want to reset this VR?',
          information: 'You try to reset this VR, All your VR information will be deleted'
        }
      }
    });
    
    this.dialogRef.onClose.subscribe(confirm => {
      if(confirm == 'affirm'){
        this.softReset();
        this.saveForm();
      }
    });
  }

  prepareData(): VrDetail {
    let vr: VrDetail = {...this.form.value} as VrDetail;    
    const crews: CrewDetail[] = [...vr.crews as CrewDetail[]];    

    let idList: string[] = [];
    for(let i=0;i<crews.length;i++)
      idList.push(crews[i].id);

    vr.crewsId = idList;
    return vr;
  }

  submit(): void {
    let vr: VrDetail = this.prepareData();
    
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(new Date(), 'dd MMM yyy HH:mm:ss');

    this.vrService.saveVRwithSubmitTime(vr, formattedDate).then(()=> {
      this.submitStatus = true;
      this.toastr.primary('Completed','VR has been submitted', {duration:10000});
      //NOTIFICAtion to training....
      this.sendToGoogleSheet(vr.date,vr.comments);
      this.sendNotificationToOPS(uuid, this.firestoreUser.getFirestoreUser().email);
      
      this.vr.submitTime = formattedDate;
      this.saveVR();
    }).catch(e=>console.log(e));
  }

  sendNotificationToOPS(uuid: string, ownerEmail: string): void {
    //NOTIFICATION TO OPS
    this.vrNotificationService.VRNotification(uuid,ownerEmail);
  }

  sendToGoogleSheet(date: string, comments: CommentDetail[]): void {
    this.vrCommentService.post(date,comments)
    .subscribe(response => {
      if(response.toString().includes('VR Comments data have been uploaded to OPS DATA studio.')){
        this.toastr.primary('Completed','Upload additional comments to Server completed', {duration:10000});
      }
    });;
  }

}
