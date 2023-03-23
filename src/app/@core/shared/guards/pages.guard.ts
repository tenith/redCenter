import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizationComponent } from '../../../pages/authorization/authorization.component';
import { DocumentsAmendmentComponent } from '../../../pages/documents-amendment/documents-amendment.component';
import { PerformanceComponent } from '../../../pages/performance/performance.component';
import { PersonalDocumentsComponent } from '../../../pages/personal-documents/personal-documents.component';
import { SepComponent } from '../../../pages/sep/sep.component';
import { FirestoreUser } from '../interfaces/firestore-user';
import { FirestoreUserService } from '../services/firestore-user.service';

@Injectable({
  providedIn: 'root'
})
export class PagesGuard implements CanActivate {

  constructor(private firestoreUserService: FirestoreUserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const firestoreUser: FirestoreUser = this.firestoreUserService.getFirestoreUser();
    const thisComponent: ActivatedRouteSnapshot["component"] = route.component;

    console.log('PagesGuard');
    console.log('User role : ' + firestoreUser.role);
    console.log('User level : ' + firestoreUser.level);

    /**
    Pilot : home, authorization, documents_amendment, personal_documents, performance, ets1, sep, logout;
    Cabin_Crew : home, documents_amendment, personal_documents, sep, logout;
    Flight_Operations : home, documents_amendment, personal_documents, logout;
    Training : home, documents_amendment, personal_documents, ets1, logout;
    Engineer : home, documents_amendment, personal_documents, logout;
    */    

    if(thisComponent === AuthorizationComponent){
      if(firestoreUser.level != 'admin'){
        this.router.navigate(['./forbidden']);
        return false;
      }

      return true;
    }

    if(thisComponent === PerformanceComponent){
      if((firestoreUser.role != 'Pilot')){
        this.router.navigate(['./forbidden']);
        return false;
      }

      return true;
    }

    if(thisComponent === SepComponent){
      if((firestoreUser.role != 'Pilot' && firestoreUser.role != 'Cabin_Crew')){
        this.router.navigate(['./forbidden']);
        return false;
      }

      return true;
    }


    return true;
  }
  
}