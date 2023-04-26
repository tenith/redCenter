import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirestoreUser } from '../interfaces/firestore-user';
import { FirestoreUserService } from '../services/firestore-user.service';

@Injectable({
  providedIn: 'root'
})
export class ModeratorGuard implements CanActivate {

  constructor(private firestoreUserService: FirestoreUserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const firestoreUser: FirestoreUser = this.firestoreUserService.getFirestoreUser();
    if(!(this.firestoreUserService.isAdmin || this.firestoreUserService.isModerator)){
      this.router.navigate(['./pages/forbidden']);
      return false;
    }

    return true;
  }
  
}
