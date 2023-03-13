import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AutolandSepCard } from '../../../@core/shared/interfaces/autoland-sep-card';
import { AutolandCardService } from '../../../@core/shared/services/autoland-card.service';

import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FirebaseAuthenticationService } from '../../../@core/shared/services/firebase-authentication.service';

@Component({
  selector: 'ngx-autoland-card',
  templateUrl: './autoland-card.component.html',
  styleUrls: ['./autoland-card.component.scss']
})
export class AutolandCardComponent implements OnInit {
  loading = true;

  @Input() name!: string;
  info: AutolandSepCard;
  myStatus: string;
  myIcon: string;

  landingDate = '';
  landingCat = '';
  landingRunway = '';
  landingAirport = '';

  minDate : string | null = ''; 
  todayDate = this.datePipe.transform(new Date(), 'YYYY-MM-dd');

  @ViewChild('autoLandingForm', {static: false}) autoLandingForm!: NgForm;

  constructor(public autoLandService: AutolandCardService, public datePipe: DatePipe) { }

  ngOnInit(): void {     
    this.autoLandService.getAutolandCard(this.name).subscribe(info => {
      if(JSON.stringify(info) == '{}'){
        this.info = {name: this.name, airport: '', perform: '', validperiod: '', expiry: ''}
      }
      else{
        this.info = {...info};
      }
      
      this.loading = false;

      this.reviseAutoLandCard();
    })
  }

  reviseAutoLandCard(): void{
    const msInDay = 24 * 60 * 60 * 1000;
    const today = new Date().getTime();
    const expire = new Date(this.info.expiry).getTime();
    const diffDate = (expire - today) / msInDay;

    if(diffDate < 0)
      this.setStatusDanger();
    if(diffDate > 30)
      this.setStatusSuccess();
    if(diffDate <= 30 && diffDate >= 0)
      this.setStatusWarning();    

    if(this.info.expiry == '')
      this.setStatusDanger();
  }

  setStatusSuccess(): void{
    this.myStatus = 'success';
    this.myIcon = 'checkmark-circle-2';
  }

  setStatusWarning(): void{
    this.myStatus = 'warning';
    this.myIcon = 'alert-triangle';
  }

  setStatusDanger(): void{
    this.myStatus = 'danger';
    this.myIcon = 'close-square';    
  }

  resetAutoLandForm(){
    this.autoLandingForm.reset();

    this.landingDate = '';
    this.landingCat = '';
    this.landingRunway = '';
    this.landingAirport = '';
  }

  submitAutoLandForm(){
    // console.log(JSON.stringify(this.autoLandingForm.value));
    // var formData : any = new FormData();
    // formData.append('email', this.firebaseAuth.getFirebaseUser().email);
    // formData.append('type', this.name);
    // formData.append('date',this.autoLandingForm.value.date);
    // formData.append('cat',this.autoLandingForm.value.cat);
    // formData.append('runway',this.autoLandingForm.value.runway);
    // formData.append('airport',this.autoLandingForm.value.airport);

    console.log(JSON.stringify(this.autoLandingForm.value));

    this.autoLandService.postAutoLandForm(this.name, this.autoLandingForm.value.date, this.autoLandingForm.value.cat, this.autoLandingForm.value.runway, this.autoLandingForm.value.airport)
    .subscribe(respone => {console.log('POST COMPLETED' + JSON.stringify(this.autoLandingForm.value)); console.log(JSON.stringify(respone))});
  }
}