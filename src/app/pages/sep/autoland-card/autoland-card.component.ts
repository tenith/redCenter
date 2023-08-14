import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { AutolandSepCard } from "../../../@core/shared/interfaces/autoland-sep-card";
import { AutolandCardService } from "../../../@core/shared/services/autoland-card.service";

import { NgForm } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { NbToastrService } from "@nebular/theme";
import { Observable, Subscription, fromEvent } from "rxjs";

import { statusConfig } from "../../../../environments/myconfigs";
import { FirebaseAuthenticationService } from "../../../@core/shared/services/firebase-authentication.service";

@Component({
  selector: "ngx-autoland-card",
  templateUrl: "./autoland-card.component.html",
  styleUrls: ["./autoland-card.component.scss"],
})
export class AutolandCardComponent implements OnInit, OnDestroy {
  loading = true;
  showForm = false;

  // @Input() name!: string;
  @Input() info: AutolandSepCard;
  @Input() events: Observable<void>;
  @Output() postCompleteEvent = new EventEmitter<string>();

  private eventsSubscription: Subscription;

  myStatus: string;
  myIcon: string;

  landingDate = "";
  landingCat = "";
  landingRunway = "";
  landingAirport = "";

  offline: boolean = true;
  offlineEvent: Observable<Event>;
  onlineEvent: Observable<Event>;
  subscriptions: Subscription[] = [];

  minDate: string | null = "";
  todayDate = this.datePipe.transform(new Date(), "YYYY-MM-dd");

  @ViewChild("autoLandingForm", { static: false }) autoLandingForm!: NgForm;

  constructor(
    public firebaseUserService: FirebaseAuthenticationService,
    public autoLandService: AutolandCardService,
    public datePipe: DatePipe,
    public toastr: NbToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  toggleFormDisplay(): void {
    this.showForm = !this.showForm;
  }

  ngOnInit(): void {
    // console.log(JSON.stringify(this.info));
    this.handleAppConnectivityChanges();

    this.reviseAutoLandCard();
    this.eventsSubscription = this.events.subscribe(() => {
      this.reviseAutoLandCard();
      this.autoLandingForm.reset();
      if (this.info.perform != "")
        this.minDate = this.datePipe.transform(
          new Date(this.info.perform),
          "YYYY-MM-dd"
        );
    });
  }

  private handleAppConnectivityChanges(): void {
    this.offline = !navigator.onLine;

    this.onlineEvent = fromEvent(window, "online");
    this.offlineEvent = fromEvent(window, "offline");

    this.subscriptions.push(
      this.onlineEvent.subscribe((e) => {
        // handle online mode
        this.offline = false;
        this.cdr.detectChanges();
      })
    );

    this.subscriptions.push(
      this.offlineEvent.subscribe((e) => {
        // handle offline mode
        this.offline = true;
        this.cdr.detectChanges();
      })
    );
  }

  ngOnDestroy(): void {
    this.eventsSubscription.unsubscribe();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  reviseAutoLandCard(): void {
    const msInDay = 24 * 60 * 60 * 1000;
    const today = new Date().getTime();
    const expire = new Date(this.info.expiry).getTime() + msInDay;
    const diffDate = (expire - today) / msInDay;

    if (diffDate < 0) this.setStatusDanger();
    if (diffDate > 30) this.setStatusSuccess();
    if (diffDate <= 30 && diffDate >= 0) this.setStatusWarning();

    if (this.info.expiry == "") this.setStatusDanger();
  }

  setStatusSuccess(): void {
    this.myStatus = statusConfig.success.status;
    this.myIcon = statusConfig.success.icon;
  }

  setStatusWarning(): void {
    this.myStatus = statusConfig.warning.status;
    this.myIcon = statusConfig.warning.icon;
  }

  setStatusDanger(): void {
    this.myStatus = statusConfig.danger.status;
    this.myIcon = statusConfig.danger.icon;
  }

  resetAutoLandForm() {
    this.autoLandingForm.reset();

    this.landingDate = "";
    this.landingCat = "";
    this.landingRunway = "";
    this.landingAirport = "";
  }

  submitAutoLandForm() {
    // console.log('post ' + JSON.stringify(this.autoLandingForm.value));
    this.autoLandService
      .postAutoLandForm(
        this.info.name,
        this.autoLandingForm.value.date,
        this.autoLandingForm.value.cat,
        this.autoLandingForm.value.runway,
        this.autoLandingForm.value.airport
      )
      .subscribe((respone) => {
        /*
        15 Mar 2023 wutthichair
          Reload Autoland when post complete
      */
        if (respone.status.toString().includes("completed")) {
          this.autoLandService.getAllAutolandCards().subscribe((response) => {
            let temp = response as AutolandSepCard[];

            this.autoLandService.deleteAllSepCards();
            this.autoLandService.saveAllSepCards(temp);

            if (this.info.name.includes("ONLINE")) this.info = { ...temp[0] };
            else this.info = { ...temp[1] };

            this.autoLandingForm.reset();
            this.postCompleteEvent.emit("post completed");
            this.toastr.primary(
              "Completed",
              "Updated Autoland history completed",
              { duration: 10000, preventDuplicates: true }
            );
            this.reviseAutoLandCard();

            this.minDate = this.datePipe.transform(
              new Date(this.info.perform),
              "YYYY-MM-dd"
            );
          });
        }
      });
  }
}
