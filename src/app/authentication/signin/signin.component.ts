import { AfterViewInit, Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { FirebaseAuthenticationService } from "../../@core/shared/services/firebase-authentication.service";
import { Subscription, interval } from "rxjs";

@Component({
  selector: "ngx-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
})
export class SigninComponent implements OnInit {
  private isLoginProgress = false;
  public loadingCredential = false;

  private mySubscription: Subscription;
  private intervalId: any;

  constructor(
    public firebaseAuthen: FirebaseAuthenticationService,
    public toastr: NbToastrService
  ) {}

  ngOnInit(): void {
    this.loadingCredential = window.location.hash === "#redirecting";
    // Clear the hash
    window.location.hash = "";

    if (this.loadingCredential)
      this.intervalId = setInterval(() => {
        this.reset();
      }, 7000);

    this.firebaseAuthen
      .getRedirect()
      .then((result) => {
        this.loadingCredential = false;
        clearInterval(this.intervalId);
        this.firebaseAuthen.byPassLoginWithUserInformation(result.user);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  reset() {
    if (!this.loadingCredential) return;

    this.toastr.danger(
      "error",
      "Unable to load your user information, Please login again."
    );
    this.loadingCredential = false;
    clearInterval(this.intervalId);
  }

  async login() {
    if (this.isLoginProgress) return;

    this.isLoginProgress = true;
    try {
      await this.firebaseAuthen.GoogleAuth();
      this.isLoginProgress = false;
    } catch (error) {
      this.toastr.danger("error", error);
      this.isLoginProgress = false;
    }
  }
}
