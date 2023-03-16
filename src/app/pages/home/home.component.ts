import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { News } from '../../@core/shared/interfaces/news';
import { FirebaseAuthenticationService } from '../../@core/shared/services/firebase-authentication.service';
import { NewsService } from '../../@core/shared/services/news.service';


@Component({
  selector: 'ngx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  newsList: News[];
  loading: boolean = true;
  constructor(public fireBaseAuth: FirebaseAuthenticationService, public toastr: NbToastrService, public newsService: NewsService) { }

  ngOnInit(): void {
    if(this.newsService.isInLocalStorage()){
      this.newsList = [...(this.newsService.getAllNewsFromCache() as News[])];
      this.loading = false;
    }
          
    /*
      Loading Information From Online Server....
    */
    this.newsService.getAllNews().subscribe(response => {
      if(response == null) {
        this.toastr.danger('Error','There is no FOC/Memo from online Server, Please check your internet connection or contact Flight Operation.', {duration:10000});
        return;
      } 

      let temp: News[] = [];
      for(let i: number = 0; i < response.length; i++){
        console.log('PUSH ' + JSON.stringify(response[i]));
        temp.push(response[i] as News);
      }

      this.toastr.primary('Completed','Updated FOC/Memo from online server completed', {duration:10000});
      this.newsList = [...temp];
      this.newsService.deleteAllNewsFromCache();
      this.newsService.saveAllNews(this.newsList);

      this.loading = false;
    });
  }

}
