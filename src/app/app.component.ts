/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { environment } from "../environments/environment";

@Component({
  selector: "ngx-app",
  template: "<router-outlet></router-outlet>",
})
export class AppComponent implements OnInit {
  currentApplicationVersion = environment.appVersion;

  constructor(private titleService: Title) {
    this.titleService.setTitle("Red Center " + this.currentApplicationVersion);
  }

  ngOnInit(): void {}
}
