import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "ngx-custom-link",
  templateUrl: "./custom-link.component.html",
  styleUrls: ["./custom-link.component.scss"],
})
export class CustomLinkComponent implements OnInit {
  @Input() rowData: any;

  constructor() {}

  ngOnInit(): void {}

  encodeTitle(title: string): string {
    return encodeURIComponent(title);
  }
}
