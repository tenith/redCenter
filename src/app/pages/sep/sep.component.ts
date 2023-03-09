import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { AutolandSepCard } from '../../@core/shared/interfaces/autoland-sep-card';
import { OneSepCard } from '../../@core/shared/interfaces/one-sep-card';
import { AutolandCardService } from '../../@core/shared/services/autoland-card.service';
import { SepCardService } from '../../@core/shared/services/sep-card.service';

@Component({
  selector: 'ngx-sep',
  templateUrl: './sep.component.html',
  styleUrls: ['./sep.component.scss']
})
export class SepComponent implements OnInit {
  loading: boolean = true;
  oneSepCards : OneSepCard[];
  autoLandCards : AutolandSepCard[];

  showAutoLand: boolean = false;
  firstTimeAlert: boolean = true;

  constructor(public toastr: NbToastrService,public sepCardService: SepCardService,public autoLandCardService: AutolandCardService) { }

  ngOnInit(): void {
    /*
      Loading Information From Cache....
    */
    if(this.sepCardService.isInLocalStorage()){
      // this.toastr.info('Info','Using SEP data from local storage.', {duration:10000});
      this.oneSepCards = [...(this.sepCardService.getAllSepCardsFromCache())];
      this.loading = false;

      this.loadAutolandCards();
    }
    else
      this.loading = true;
          
    /*
      Loading Information From Online Server....
    */
    this.sepCardService.getAllSepCards().subscribe(response => {
      if(response == null) {
        this.toastr.danger('Error','There is no SEP information from online Server, Please check your internet connection or contact TMS.', {duration:10000});
        return;
      } 

      const tempSubjects = response['courses'];
      
      let temp: OneSepCard[] = [];
      for(let i: number = 0; i < tempSubjects.length; i++){
        temp.push(response[tempSubjects[i]][0]);
      }

      this.toastr.primary('Completed','Updated SEP from online server completed', {duration:10000});
      this.oneSepCards = [...temp];
      this.sepCardService.deleteAllSepCards();
      this.sepCardService.saveAllSepCards(this.oneSepCards);

      this.loadAutolandCards();
      this.loading = false;
    });
  }

  loadAutolandCards(): void {
    if(!this.isLVOCertified())
      return;

    if(this.autoLandCardService.isInLocalStorage()){
      // this.toastr.info('Info','Using Autoland data from local storage.', {duration:10000});
      this.autoLandCards = [...(this.autoLandCardService.getAllAutolandCardsFromCache())];
      this.showAutoLand = true;
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
      if(!this.firstTimeAlert)
        this.toastr.primary('Completed','Updated Autoland history completed', {duration:10000, preventDuplicates: true});

      this.firstTimeAlert = false;
      this.showAutoLand = true;
      this.autoLandCardService.deleteAllSepCards();
      this.autoLandCardService.saveAllSepCards(this.autoLandCards);
    });
  }

  isLVOCertified(): boolean {
    if(this.oneSepCards == null)
      return false;
    
    for(let i: number = 0; i < this.oneSepCards.length; i++)
      if(this.oneSepCards[i].name.includes('LVO'))
        return true;
    
    return false;
  }
}
