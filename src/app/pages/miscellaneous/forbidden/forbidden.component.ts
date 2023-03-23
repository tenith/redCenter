import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.scss']
})
export class ForbiddenComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  goToHome() {
    this.router.navigate(['./pages/']);
  }

}
