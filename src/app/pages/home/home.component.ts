import { Component, OnInit } from '@angular/core';
import { FirestoreUser } from '../../@core/shared/interfaces/firestore-user';
import { FirestoreUserService } from '../../@core/shared/services/firestore-user.service';

import { aocOptions, roleOptions } from '../../../environments/myconfigs';
import { Invoice } from '../../@core/shared/interfaces/invoice';
import { baseURL } from '../../../environments/environment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  firestoreUser: FirestoreUser;
  aocURL : string;
  roleURL : string;
  invoices: Invoice[] = [];
  myURL: string;
  constructor(private firestoreUserService: FirestoreUserService) { }

  ngOnInit(): void {
    this.firestoreUser = this.firestoreUserService.getFirestoreUser();
    this.invoices = this.firestoreUser.invoice;

    this.myURL = baseURL + 'onlinechecking?email=' + this.firestoreUserService.getFirestoreUser().email + '&token=' + btoa(this.firestoreUserService.getFirestoreUser().email);

    this.aocURL = aocOptions[aocOptions.findIndex(obj => obj.value === this.firestoreUser.aoc)].icon;
    this.roleURL = roleOptions[roleOptions.findIndex(obj => obj.value === this.firestoreUser.role)].icon;
  }

  // newsList: News[];
  // loading: boolean = true;
  // constructor(public fireBaseAuth: FirebaseAuthenticationService, public toastr: NbToastrService, public newsService: NewsService) { }

  // ngOnInit(): void {
  //   if(this.newsService.isInLocalStorage()){
  //     this.newsList = [...(this.newsService.getAllNewsFromCache() as News[])];
  //     this.loading = false;
  //   }
          
  //   /*
  //     Loading Information From Online Server....
  //   */
  //   this.newsService.getAllNews().subscribe(response => {
  //     if(response == null) {
  //       this.toastr.danger('Error','There is no FOC/Memo from online Server, Please check your internet connection or contact Flight Operation.', {duration:10000});
  //       return;
  //     } 

  //     let temp: News[] = [];
  //     for(let i: number = 0; i < response.length; i++){
  //       temp.push(response[i] as News);
  //     }

  //     this.toastr.primary('Completed','Updated FOC/Memo from online server completed', {duration:10000});
  //     this.newsList = [...temp];
  //     this.newsService.deleteAllNewsFromCache();
  //     this.newsService.saveAllNews(this.newsList);

  //     this.loading = false;
  //   });
  // }

}
