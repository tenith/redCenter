import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AutolandSepCard } from '../../../@core/shared/interfaces/autoland-sep-card';
import { AutolandCardService } from '../../../@core/shared/services/autoland-card.service';

import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NbToastrService } from '@nebular/theme';
import { Observable, Subscription } from 'rxjs';

import { statusConfig } from '../../../../environments/myconfigs';

@Component({
  selector: 'ngx-autoland-card',
  templateUrl: './autoland-card.component.html',
  styleUrls: ['./autoland-card.component.scss']
})
export class AutolandCardComponent implements OnInit, OnDestroy {
  loading = true;

  // @Input() name!: string;
  @Input() info: AutolandSepCard;
  @Input() events: Observable<void>;
  @Output() postCompleteEvent = new EventEmitter<string>();

  private eventsSubscription: Subscription;

  myStatus: string;
  myIcon: string;

  landingDate = '';
  landingCat = '';
  landingRunway = '';
  landingAirport = '';

  minDate : string | null = ''; 
  todayDate = this.datePipe.transform(new Date(), 'YYYY-MM-dd');

  @ViewChild('autoLandingForm', {static: false}) autoLandingForm!: NgForm;

  constructor(public autoLandService: AutolandCardService, public datePipe: DatePipe, public toastr: NbToastrService) { }

  ngOnInit(): void {     
    // console.log(JSON.stringify(this.info));
    this.reviseAutoLandCard();
    this.eventsSubscription = this.events.subscribe(() => {
      this.reviseAutoLandCard();
      this.autoLandingForm.reset();
      if(this.info.perform != '')
        this.minDate = this.datePipe.transform(new Date(this.info.perform), 'YYYY-MM-dd');
    });
  }

  ngOnDestroy(): void {
    this.eventsSubscription.unsubscribe();
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
    this.myStatus = statusConfig.success.status;
    this.myIcon = statusConfig.success.icon;
  }

  setStatusWarning(): void{
    this.myStatus = statusConfig.warning.status;
    this.myIcon = statusConfig.warning.icon;
  }

  setStatusDanger(): void{
    this.myStatus = statusConfig.danger.status;
    this.myIcon = statusConfig.danger.icon;    
  }

  resetAutoLandForm(){
    this.autoLandingForm.reset();

    this.landingDate = '';
    this.landingCat = '';
    this.landingRunway = '';
    this.landingAirport = '';
  }

  submitAutoLandForm(){
    // console.log('post ' + JSON.stringify(this.autoLandingForm.value));
    this.autoLandService.postAutoLandForm(this.info.name, this.autoLandingForm.value.date, this.autoLandingForm.value.cat, this.autoLandingForm.value.runway, this.autoLandingForm.value.airport)
    .subscribe(respone => {
      /*
        15 Mar 2023 wutthichair
          Reload Autoland when post complete
      */ 
      if(respone.status.toString().includes('completed')){
        this.autoLandService.getAllAutolandCards().subscribe(response =>{
          let temp = response as AutolandSepCard[];

          this.autoLandService.deleteAllSepCards();
          this.autoLandService.saveAllSepCards(temp);

          if(this.info.name.includes('ONLINE'))
            this.info = {...temp[0]};
          else
            this.info = {...temp[1]};
          
          this.autoLandingForm.reset();
          this.postCompleteEvent.emit('post completed');
          this.toastr.primary('Completed','Updated Autoland history completed', {duration:10000, preventDuplicates: true});
          this.reviseAutoLandCard();

          this.minDate = this.datePipe.transform(new Date(this.info.perform), 'YYYY-MM-dd');
        });
      }
    });
  }
}