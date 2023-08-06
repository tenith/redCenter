import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subscription, fromEvent } from "rxjs";

@Component({
  selector: "ngx-documents-amendment",
  templateUrl: "./documents-amendment.component.html",
  styleUrls: ["./documents-amendment.component.scss"],
})
export class DocumentsAmendmentComponent implements OnInit, OnDestroy {
  online: boolean = true;
  offlineEvent: Observable<Event>;
  onlineEvent: Observable<Event>;
  subscriptions: Subscription[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnInit(): void {
    this.handleAppConnectivityChanges();
  }

  private handleAppConnectivityChanges(): void {
    this.online = navigator.onLine;

    this.onlineEvent = fromEvent(window, "online");
    this.offlineEvent = fromEvent(window, "offline");

    this.subscriptions.push(
      this.onlineEvent.subscribe((e) => {
        // handle online mode
        this.online = true;
        this.cdr.detectChanges();
      }),
    );

    this.subscriptions.push(
      this.offlineEvent.subscribe((e) => {
        // handle offline mode
        this.online = false;
        this.cdr.detectChanges();
      }),
    );
  }
}
