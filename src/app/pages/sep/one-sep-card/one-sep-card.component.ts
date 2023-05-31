import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy  } from '@angular/core';
import { OneSepCard } from '../../../@core/shared/interfaces/one-sep-card';
import { SepCardService } from '../../../@core/shared/services/sep-card.service';

import { statusConfig } from '../../../../environments/myconfigs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, Subscription, interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { FileUploadDatabaseService } from '../../../@core/shared/services/file-upload-database.service';
import { ManualCardService } from '../../../@core/shared/services/manual-card.service';

@Component({
  selector: 'ngx-one-sep-card',
  templateUrl: './one-sep-card.component.html',
  styleUrls: ['./one-sep-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OneSepCardComponent implements OnInit, OnDestroy {
  @Input() info!: OneSepCard;
  myStatus: string;
  myIcon: string;

  cacheLink: SafeResourceUrl;
  uri: string = '';
  dataReady: boolean = false;

  isPersonalDocument: boolean = false;
  downloadUrl$: Observable<string>;

  private pollSubscription: Subscription;
  safeURL: SafeResourceUrl;

  constructor(private manualCardService: ManualCardService, private fileUploadDatabaseService: FileUploadDatabaseService, public sepService: SepCardService, private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef) {}
  ngOnDestroy(): void {
    this.stopPolling();
  }

  ngOnInit(): void { 
    if(this.info.Type == 'Personal Upload'){
      this.isPersonalDocument = true;
      this.downloadUrl$ = this.fileUploadDatabaseService.getFile(this.info.Link);
    }

    this.startPolling();    
    
    const msInDay = 24 * 60 * 60 * 1000;
    const today = new Date().getTime();
    const expire = new Date(this.info.Expiry).getTime();
    const diffDate = (expire - today) / msInDay;

    if(diffDate < 0)
      this.setStatusDanger();
    if(diffDate > 30)
      this.setStatusSuccess();
    if(diffDate <= 30 && diffDate >= 0)
      this.setStatusWarning();    
  }

  startPolling() {
    this.pollSubscription = interval(2000) // Adjust the polling interval as per your requirements
      .pipe(take(100)) // Limit the number of polls to avoid infinite looping
      .subscribe(() => {
        this.checkFileStatus();
      });
  }

  stopPolling() {
    this.dataReady = true;
    this.cdr.detectChanges();
    if (this.pollSubscription) {
      this.pollSubscription.unsubscribe();
    }
  }

  checkFileStatus(): void {
    if(this.info.Link == '')
      this.stopPolling();
    else{
      if(!this.isPersonalDocument){
        this.sepService.getURIByLink(this.info.Name.replace(/ /g,'_')+this.info.Attended.replace(/ /g,'_')).subscribe((data)=>{
          if(data != null){
            this.uri = data.uri;
            this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.uri);
            this.cdr.detectChanges();
            this.stopPolling();
          }
        });
      }

      if(this.isPersonalDocument){
        this.manualCardService.getURIByLink(this.info.Link).subscribe((data)=>{
          if(data != null){
            this.uri = data.uri;
            this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.uri);
            this.cdr.detectChanges();
            this.stopPolling();
          }
        });
      }
    }  
  }

  getSafeURL(): SafeResourceUrl {
    return this.safeURL;
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
