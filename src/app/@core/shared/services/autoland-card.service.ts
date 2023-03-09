import { Injectable } from '@angular/core';

import { of as observableOf,  Observable } from 'rxjs';
import { autoLandCardMockup } from '../../mock/autoland-mockup-data';
import { AutolandSepCard } from '../interfaces/autoland-sep-card';

@Injectable({
  providedIn: 'root'
})
export class AutolandCardService {
  autoLandCard: AutolandSepCard[];

  constructor() { 
    this.autoLandCard = [...autoLandCardMockup];
  }
  
  getAutolandCard(name: string): Observable<AutolandSepCard> {
    if(name.includes('ONLINE'))
      return observableOf(this.autoLandCard[0]);
    else
      return observableOf(this.autoLandCard[1]);
  }

  getAllAutolandCards(): Observable<AutolandSepCard[]>{
    return observableOf(this.autoLandCard);
  }

  getAutolandCardFromCache(name: string): Observable<AutolandSepCard>{
    if(name.includes('ONLINE'))
      return observableOf(this.autoLandCard[0]);
    else
      return observableOf(this.autoLandCard[1]);
  }

  getAllAutolandCardsFromCache(): Observable<AutolandSepCard[]>{
    return observableOf(this.autoLandCard);
  }
}
