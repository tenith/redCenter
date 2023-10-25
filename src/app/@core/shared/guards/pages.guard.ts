import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthorizationComponent } from "../../../pages/authorization/authorization.component";
import { PerformanceComponent } from "../../../pages/performance/performance.component";
import { SepComponent } from "../../../pages/sep/sep.component";
import { FirestoreUser } from "../interfaces/firestore-user";
import { FirestoreUserService } from "../services/firestore-user.service";

import { userLevel } from "../../../../environments/myconfigs";
import { roleName } from "../../../../environments/myconfigs";
import { DocumentsAmendmentComponent } from "../../../pages/documents-amendment/documents-amendment.component";
import { DocumentVerificationComponent } from "../../../pages/document-verification/document-verification.component";
import { VerificationHistoryComponent } from "../../../pages/verification-history/verification-history/verification-history.component";

@Injectable({
  providedIn: "root",
})
export class PagesGuard implements CanActivate {
  constructor(
    private firestoreUserService: FirestoreUserService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const firestoreUser: FirestoreUser =
      this.firestoreUserService.getFirestoreUser();
    const thisComponent: ActivatedRouteSnapshot["component"] = route.component;

    // console.log('PagesGuard');
    // console.log('User role : ' + firestoreUser.role);
    // console.log('User level : ' + firestoreUser.level);

    // console.log(thisComponent);

    /**
    Admin: ['home', 'authorization', 'documents_amendment', 'personal_documents', 'document_verification', 'eVR', 'performance', 'ets1', 'sep', 'logout'],
    Pilot: ['home', 'documents_amendment', 'personal_documents', 'eVR', 'performance', 'ets1', 'sep', 'logout'],
    Cabin_Crew: ['home', 'documents_amendment', 'personal_documents', 'sep', 'logout'],
    Flight_Operations: ['home', 'documents_amendment', 'personal_documents', 'document_verification', 'eVR', 'logout'],
    Training: ['home', 'documents_amendment', 'personal_documents', 'ets1', 'logout'],
    Engineer:  ['home', 'documents_amendment', 'personal_documents', 'logout'],
    CCD_TEAM: ['home', 'personal_documents', 'document_verification', 'logout'],
    */

    if (thisComponent === AuthorizationComponent) {
      if (firestoreUser.level != userLevel.admin) {
        this.router.navigate(["./pages/forbidden"]);
        return false;
      }

      return true;
    }

    if (thisComponent === DocumentsAmendmentComponent) {
      if (firestoreUser.role == roleName.ccd_team) {
        this.router.navigate(["./pages/forbidden"]);
        return false;
      }

      return true;
    }

    if (
      thisComponent === DocumentVerificationComponent ||
      thisComponent === VerificationHistoryComponent
    ) {
      if (
        firestoreUser.role == roleName.cabinCrew &&
        firestoreUser.level == userLevel.moderatore
      ) {
        return true;
      }

      if (
        firestoreUser.role != roleName.ccd_team &&
        firestoreUser.role != roleName.fltOPS &&
        firestoreUser.level != userLevel.admin
      ) {
        this.router.navigate(["./pages/forbidden"]);
        return false;
      }

      return true;
    }

    if (thisComponent === PerformanceComponent) {
      if (firestoreUser.role != roleName.pilot) {
        this.router.navigate(["./pages/forbidden"]);
        return false;
      }

      return true;
    }

    if (thisComponent === SepComponent) {
      if (
        firestoreUser.role != roleName.pilot &&
        firestoreUser.role != roleName.cabinCrew
      ) {
        this.router.navigate(["./pages/forbidden"]);
        return false;
      }

      return true;
    }

    return true;
  }
}
