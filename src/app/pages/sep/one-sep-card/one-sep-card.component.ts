import { Component, Input, OnInit } from '@angular/core';
import { OneSepCard } from '../../../@core/shared/interfaces/one-sep-card';


@Component({
  selector: 'ngx-one-sep-card',
  templateUrl: './one-sep-card.component.html',
  styleUrls: ['./one-sep-card.component.scss']
})
export class OneSepCardComponent implements OnInit {
  @Input() info!: OneSepCard;
  myStatus: string;
  myIcon: string;

  constructor() { }

  ngOnInit(): void { 
    if(this.info.validperiod.toUpperCase() == 'LIFETIME'){
      this.setStatusSuccess();
    }
    else{
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
    }
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

}
