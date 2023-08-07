import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FirebaseAuthenticationService } from "../../@core/shared/services/firebase-authentication.service";
import { FirestoreUserService } from "../../@core/shared/services/firestore-user.service";
import { FirestoreUser } from "../../@core/shared/interfaces/firestore-user";
import { DatePipe } from "@angular/common";

@Component({
  selector: "ngx-remote-sep",
  templateUrl: "./remote-sep.component.html",
  styleUrls: ["./remote-sep.component.scss"],
})
export class RemoteSEPComponent implements OnInit, OnDestroy {
  email: string = "";
  token: string = "";
  loading: boolean = true;
  foundUser: boolean = false;
  invalidToken: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private firebaseAuth: FirebaseAuthenticationService,
    private firestoreUserService: FirestoreUserService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const email = params.email;
      const token = params.token;

      if (btoa(email) == token) {
        this.invalidToken = false;
        this.firebaseAuth.AnynomousAuth(email).then(() => {
          this.firestoreUserService
            .getFirestoreUserFromServerByEmail(email)
            .then((doc) => {
              this.loading = false;
              if (doc.exists) {
                const tempFirestoreUser = { ...doc.data() } as FirestoreUser;
                this.firestoreUserService.setFirestoreUser(tempFirestoreUser);
                this.foundUser = true;
              } else this.foundUser = false;
            });
        });
      } else {
        this.invalidToken = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.firebaseAuth.logout();
  }
}
