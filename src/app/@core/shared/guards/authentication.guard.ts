import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseAuthenticationService } from '../services/firebase-authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private firebaseAuthenticationService: FirebaseAuthenticationService, private router: Router) {}
  
  canActivate(    
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if(this.firebaseAuthenticationService.getFirebaseUser() == null){
        this.router.navigate(['./authentication/']);
        return false;
      }

    return true;
  }
  
}
