import { Component, OnInit } from '@angular/core';
import { OneSepCard } from '../../@core/shared/interfaces/one-sep-card';
import { SepCardService } from '../../@core/shared/services/sep-card.service';

@Component({
  selector: 'ngx-sep',
  templateUrl: './sep.component.html',
  styleUrls: ['./sep.component.scss']
})
export class SepComponent implements OnInit {

  loading: boolean = true;
  oneSepCards : OneSepCard[];

  constructor(sepCardService: SepCardService) {
    sepCardService.getAllSepCards().subscribe(allSepCards => {
      console.log(JSON.stringify(allSepCards)); 
      this.oneSepCards = [...allSepCards]; 
      setTimeout(() => this.loading = false, 3000);
    });
  }

  ngOnInit(): void {
  }

}
