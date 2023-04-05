import { Component, Input, OnInit } from '@angular/core';
import { Announcement } from '../../../@core/shared/interfaces/announcement';
import { Signature } from '../../../@core/shared/interfaces/signature';

@Component({
  selector: 'ngx-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {
  loading: boolean = false;
  acknowledge: boolean = false;
  @Input() announcement?: Announcement;
  
  constructor() { 
    this.announcement = {
      author: 'Flight Operation',
      code: 'TAA/XXX/2023',
      title: 'Test Title',
      body: '<b>test body</b>',
      publishedDate: '23 Mar 2023',
      effectiveDate: '23 Mar 2023',
      endDate: '23 Mar 2023',
      acknowledge: true,
      audience: 'Pilot',
      signatures: [],
    }
  }

  ngOnInit(): void {
    // console.log(JSON.stringify(this.announcement));
  }

}
