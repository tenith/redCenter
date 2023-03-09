import { Injectable } from '@angular/core';
import { OneSepCard } from '../interfaces/one-sep-card';
import { oneSepCardsMockUp } from '../../mock/sep-card-mockup-data';

import { of as observableOf,  Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SepCardService {
  oneSepCards: OneSepCard[];

  constructor() { 
    this.oneSepCards = [...oneSepCardsMockUp];
  }

  getAllSepCards(): Observable<OneSepCard[]> {
    return observableOf(this.oneSepCards);
  }
}
