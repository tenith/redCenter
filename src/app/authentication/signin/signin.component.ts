import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { FirebaseAuthenticationService } from "../../@core/shared/services/firebase-authentication.service";

@Component({
  selector: "ngx-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
})
export class SigninComponent implements OnInit {
  private isLoginProgress = false;
  public loadingCredential = false;

  constructor(
    public firebaseAuthen: FirebaseAuthenticationService,
    public toastr: NbToastrService
  ) {}

  ngOnInit(): void {
    this.loadingCredential = window.location.hash === "#redirecting";
    // Clear the hash
    window.location.hash = "";

    this.firebaseAuthen
      .getRedirect()
      .then((result) => {
        this.firebaseAuthen.byPassLoginWithUserInformation(result.user);
      })
      .catch((error) => {
        console.log(error);
      });
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
