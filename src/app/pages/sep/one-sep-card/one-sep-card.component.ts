import { Component, Input, OnInit, ChangeDetectionStrategy  } from '@angular/core';
import { OneSepCard } from '../../../@core/shared/interfaces/one-sep-card';
import { SepCardService } from '../../../@core/shared/services/sep-card.service';

import { statusConfig } from '../../../../environments/myconfigs';

@Component({
  selector: 'ngx-one-sep-card',
  templateUrl: './one-sep-card.component.html',
  styleUrls: ['./one-sep-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OneSepCardComponent implements OnInit {
  @Input() info!: OneSepCard;
  myStatus: string;
  myIcon: string;

  cacheLink: string = '';

  constructor(public temp: SepCardService) {}

  ngOnInit(): void { 
    this.temp.getURIByLink(this.info.link).subscribe((data)=>{
      if(data != null)
        this.cacheLink = data.uri;
    });

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

}
