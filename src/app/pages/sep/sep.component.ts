import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { AutolandSepCard } from '../../@core/shared/interfaces/autoland-sep-card';
import { OneSepCard } from '../../@core/shared/interfaces/one-sep-card';
import { AutolandCardService } from '../../@core/shared/services/autoland-card.service';
import { FirebaseAuthenticationService } from '../../@core/shared/services/firebase-authentication.service';
import { SepCardService } from '../../@core/shared/services/sep-card.service';

@Component({
  selector: 'ngx-sep',
  templateUrl: './sep.component.html',
  styleUrls: ['./sep.component.scss']
})
export class SepComponent implements OnInit {
  /*
    15 Mar 2023 wutthichair
  */
  validList: string[] = [];
  aboutList: string[] = [];
  expiredList: string[] = [];

  loading: boolean = true;
  oneSepCards : OneSepCard[];
  autoLandCards : AutolandSepCard[];

  changeEvent: Subject<void> = new Subject<void>();

  showAutoLand: boolean = false;
  firstTimeAlert: boolean = true;

  constructor(public fireBaseAuth: FirebaseAuthenticationService, public toastr: NbToastrService,public sepCardService: SepCardService,public autoLandCardService: AutolandCardService) { }

  ngOnInit(): void {
    this.autoLandCards = [{name: 'AUTOLAND - ONLINE', airport: '', perform: '', validperiod: '', expiry: ''},
                           {name: 'AUTOLAND - SIMULATOR', airport: '', perform: '', validperiod: '', expiry: ''}];

    /*
      Loading Information From Cache....
    */
    if(this.sepCardService.isInLocalStorage()){
      this.oneSepCards = [...(this.sepCardService.getAllSepCardsFromCache())];
      this.loading = false;

      this.loadAutolandCards();
    }
          
    /*
      Loading Information From Online Server....
    */
    this.sepCardService.getAllSepCards().subscribe(response => {
      console.log('JSON REDBOOK API: ' + JSON.stringify(response));
      if(response == null) {
        this.toastr.danger('Error','There is no SEP information from online Server, Please check your internet connection or contact TMS.', {duration:10000});
        return;
      } 

      const tempSubjects = response['Courses'];

      let temp: OneSepCard[] = [];
      for(let i: number = 0; i < tempSubjects.length; i++){
        if(response[tempSubjects[i]] != undefined){
          console.log('Push: ' +  JSON.stringify(response[tempSubjects[i]][0]));
          temp.push(response[tempSubjects[i]][0]);
        }
      }

      this.loading = false;
      this.toastr.primary('Completed','Updated SEP from online server completed', {duration:10000});
      this.oneSepCards = [...temp];
      this.sepCardService.deleteAllSepCards();
      this.sepCardService.saveAllSepCards(this.oneSepCards);

      this.loadAutolandCards();
      // this.loading = false;

      this.updateSummary();
    });
  }

  public jumpTo(elementId: string): void { 
    const elmnt = document.getElementById(elementId);
    elmnt.scrollIntoView({behavior: "auto", block: "center", inline: "nearest"});
  }

  updateSummary(): void {
    this.validList = [];
    this.aboutList = [];
    this.expiredList = [];

    this.updateSEPSummary();
    this.updateAutoLandSummary();
  }

  updateSEPSummary(): void{
    if(this.oneSepCards == null)
      return;

    for(let i=0;i<this.oneSepCards.length;i++){
      const msInDay = 24 * 60 * 60 * 1000;
      const today = new Date().getTime();
      const expire = new Date(this.oneSepCards[i].Expiry).getTime();
      const diffDate = (expire - today) / msInDay;

      if(diffDate < 0)
        this.expiredList.push(this.oneSepCards[i].Name);
      if(diffDate > 30)
        this.validList.push(this.oneSepCards[i].Name);
      if(diffDate <= 30 && diffDate >= 0)
        this.aboutList.push(this.oneSepCards[i].Name);

      if(this.oneSepCards[i].Expiry == '')
        this.validList.push(this.oneSepCards[i].Name);
    }
  }

  updateAutoLandSummary(): void {
    if(this.autoLandCards == null)
      return;
    
      for(let i=0;i<this.autoLandCards.length;i++){
        const msInDay = 24 * 60 * 60 * 1000;
        const today = new Date().getTime();
        const expire = new Date(this.autoLandCards[i].expiry).getTime();
        const diffDate = (expire - today) / msInDay;
  
        if(diffDate < 0)
          this.expiredList.push(this.autoLandCards[i].name);
        if(diffDate > 30)
          this.validList.push(this.autoLandCards[i].name);
        if(diffDate <= 30 && diffDate >= 0)
          this.aboutList.push(this.autoLandCards[i].name);
      }
  }

  loadAutolandCards(): void {
    if(!this.isLVOCertified())
      return;

    if(this.autoLandCardService.isInLocalStorage()){
      this.autoLandCards = [...(this.autoLandCardService.getAllAutolandCardsFromCache())];
      this.showAutoLand = true;

      this.updateSummary();
    }
    
    this.autoLandCardService.getAllAutolandCards().subscribe(autoLandCards => {
      if(autoLandCards == null) {
        this.toastr.danger('Error','There is no Autoland history from online Server, Please check your internet connection or contact TMS.', {duration:10000});
        return;
      } 
      if(autoLandCards.length == 0) {
        this.toastr.danger('Error','Autoland history from your cache is error, Please check your internet connection or contact TMS.', {duration:10000});
        return;
      }

      this.autoLandCards = [...autoLandCards];
      // console.log('GET AUTOLAND JSON :' + JSON.stringify(this.autoLandCards));

      if(!this.firstTimeAlert)
        this.toastr.primary('Completed','Updated Autoland history from online server completed', {duration:10000, preventDuplicates: true});

      this.firstTimeAlert = false;
      this.showAutoLand = true;
      this.autoLandCardService.deleteAllSepCards();
      this.autoLandCardService.saveAllSepCards(this.autoLandCards);
      this.changeEvent.next();

      this.updateSummary();
    });

    
  }

  isLVOCertified(): boolean {
    if(this.oneSepCards == null)
      return false;
    
    for(let i: number = 0; i < this.oneSepCards.length; i++)
      if(this.oneSepCards[i].Name.includes('LVO'))
        return true;
    
    return false;
  }
}
