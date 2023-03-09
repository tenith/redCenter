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

  constructor(public toastr: NbToastrService, sepCardService: SepCardService, autoLandCardService: AutolandCardService) {
    /*
      Loading Information From Cache....
    */
    sepCardService.getAllSepCardsFromCache().subscribe(allSepCards => {
      if(allSepCards == null) {
        this.toastr.info('Info','There is no SEP information from your cache', {duration:5000});
        return;
      } 
      if(allSepCards.length == 0) {
        this.toastr.info('Info','SEP information from your cache is error', {duration:5000});
        return;
      }

      this.toastr.primary('Info','SEP information from cache, loading completed', {duration:5000});
      this.oneSepCards = [...allSepCards]; 
      this.loading = false;
    });

    autoLandCardService.getAllAutolandCardsFromCache().subscribe(autoLandCards => {
      if(autoLandCards == null) {
        this.toastr.info('Info','There is no Autoland history from your cache', {duration:5000});
        return;
      } 
      if(autoLandCards.length == 0) {
        this.toastr.info('Info','Autoland history from your cache is error', {duration:5000});
        return;
      }

      this.showAutoLand = true; 
      this.toastr.primary('Info','Autoland history from cache, loading completed', {duration:5000});
      this.autoLandCards = [...autoLandCards];
    });

    /*
      Loading Information From Online Server....
    */
    sepCardService.getAllSepCards().subscribe(allSepCards => {
      if(allSepCards == null) {
        this.toastr.danger('Error','There is no SEP information from online Server, Please check your internet connection or contact TMS.', {duration:5000});
        return;
      } 
      if(allSepCards.length == 0) {
        this.toastr.danger('Error','SEP Information From your Cache is error, Please check your internet connection or contact TMS.', {duration:5000});
        return;
      }

      this.toastr.success('Completed','Updated SEP from online server completed', {duration:5000});
      this.oneSepCards = [...allSepCards]; 
      this.loading = false;
    });

    autoLandCardService.getAllAutolandCards().subscribe(autoLandCards => {
      if(autoLandCards == null) {
        this.toastr.danger('Error','There is no Autoland history from online Server, Please check your internet connection or contact TMS.', {duration:5000});
        return;
      } 
      if(autoLandCards.length == 0) {
        this.toastr.danger('Error','Autoland history from your cache is error, Please check your internet connection or contact TMS.', {duration:5000});
        return;
      }

      this.showAutoLand = true;
      this.toastr.success('Completed','Updated Autoland history completed', {duration:5000});
      this.autoLandCards = [...autoLandCards];
    });
  }

  ngOnInit(): void {
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
