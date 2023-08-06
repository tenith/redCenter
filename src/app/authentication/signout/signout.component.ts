import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AutolandCardService } from "../../@core/shared/services/autoland-card.service";
import { FirebaseAuthenticationService } from "../../@core/shared/services/firebase-authentication.service";
import { FirestoreUserService } from "../../@core/shared/services/firestore-user.service";
import { NewsService } from "../../@core/shared/services/news.service";
import { SepCardService } from "../../@core/shared/services/sep-card.service";
import { ManualCardService } from "../../@core/shared/services/manual-card.service";
import { SepHistoicalService } from "../../@core/shared/services/sepHistorical.service";

@Component({
  selector: "ngx-signout",
  templateUrl: "./signout.component.html",
  styleUrls: ["./signout.component.scss"],
})
export class SignoutComponent implements OnInit {
  constructor(
    private sepHistorical: SepHistoicalService,
    private manualCardService: ManualCardService,
    public firestoreUserService: FirestoreUserService,
    public newsService: NewsService,
    public firebaseAuthen: FirebaseAuthenticationService,
    public sepCardService: SepCardService,
    public autolandCardService: AutolandCardService,
    public router: Router,
    public location: Location,
  ) {}

  ngOnInit(): void {
    if (this.firebaseAuthen.getFirebaseUser() == null)
      this.router.navigate(["./authentication/signin"]);
  }

  public back(): void {
    this.location.back();
  }

  /*
    15 MAR 2023 wutthichair
      Implement logout function to clear user cache.
  */
  public async logout(): Promise<any> {
    await this.firestoreUserService.deleteToken();
    this.sepCardService.deleteAllSepCards();
    this.manualCardService.deleteAllCards();
    this.autolandCardService.deleteAllSepCards();
    this.newsService.deleteAllNewsFromCache();
    this.sepHistorical.deleteSEPHistorical();

    this.firebaseAuthen.logout();
    this.firestoreUserService.logout();
  }
}
