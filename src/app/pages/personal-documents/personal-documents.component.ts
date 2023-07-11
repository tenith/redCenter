import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'ngx-personal-documents',
  templateUrl: './personal-documents.component.html',
  styleUrls: ['./personal-documents.component.scss']
})
export class PersonalDocumentsComponent implements OnInit, OnDestroy {

  online: boolean = true;
  offlineEvent: Observable<Event>;
  onlineEvent: Observable<Event>;
  subscriptions: Subscription[] = [];
  preSelected: string = '';

  constructor(private cdr: ChangeDetectorRef, private route: ActivatedRoute) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngOnInit(): void {
    this.preSelected = this.route.snapshot.queryParamMap.get('email') == null ? '' : this.route.snapshot.queryParamMap.get('email');
    this.handleAppConnectivityChanges();
  }

  private handleAppConnectivityChanges(): void {
    this.online = navigator.onLine;

    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');

    this.subscriptions.push(this.onlineEvent.subscribe(e => {
      // handle online mode
      this.online = true;
      this.cdr.detectChanges();
    }));

    this.subscriptions.push(this.offlineEvent.subscribe(e => {
      // handle offline mode
      this.online = false;
      this.cdr.detectChanges();
    }));
  }

}
