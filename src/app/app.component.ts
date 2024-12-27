/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { environment } from "../environments/environment";
import { AngularFireAnalytics } from "@angular/fire/compat/analytics";

@Component({
  selector: "ngx-app",
  template: "<router-outlet></router-outlet>",
})
export class AppComponent implements OnInit {
  currentApplicationVersion = environment.appVersion;

  constructor(
    private titleService: Title,
    private analytics: AngularFireAnalytics
  ) {
    this.titleService.setTitle("Red Center " + this.currentApplicationVersion);
    // Set app version as a user property
    this.analytics.setUserProperties({
      app_version: this.currentApplicationVersion,
    });
  }

  ngOnInit(): void {}
}
