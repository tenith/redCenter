import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { roleOptions } from '../../../@core/shared/interfaces/aoc-role-level';
import { AnnouncementService } from '../../../@core/shared/services/announcement.service';
import { Announcement } from '../../../@core/shared/interfaces/announcement';
import { error } from 'console';
import { NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-posting-documents-amendment',
  templateUrl: './posting-documents-amendment.component.html',
  styleUrls: ['./posting-documents-amendment.component.scss']
})
export class PostingDocumentsAmendmentComponent implements OnInit {
  @Input() myInput: string;

  postingForm: FormGroup;

  audienceGroups = roleOptions;

  constructor(private formBuilder: FormBuilder, private toastr: NbToastrService, private announcementService: AnnouncementService, private router: Router) { }

  ngOnInit(): void {
    this.postingForm = this.formBuilder.group({
      // author: ['Flight Operation', Validators.required],
      // code: ['TAA/MEMO/2023/1', Validators.required],
      // title: ['Speed brake usage duing high power', Validators.required],
      // body: ['<b>test body</b>', Validators.required],
      // publishedDate: ['23 Mar 2023', Validators.required],
      // effectiveDate: ['23 Mar 2023', Validators.required],
      // endDate: ['23 Mar 2023', Validators.required],
      // acknowledge: ['Yes', Validators.required],
      // audience: ['Pilot', Validators.required]

      author: ['', Validators.required],
      code: ['', Validators.required],
      title: ['', Validators.required],
      body: [' ', Validators.required],
      publishedDate: ['', Validators.required],
      effectiveDate: ['', Validators.required],
      endDate: ['', Validators.required],
      acknowledge: ['Yes', Validators.required],
      audience: ['Pilot', Validators.required]
    });    
  }

  onSubmit() {
    // Process form data here
    console.log(this.postingForm.value);
    const temp = {...this.postingForm.value, signatures:[]} as Announcement;
    this.announcementService.addAnnouncement(temp).then(()=>{
      this.toastr.primary('Completed','Make an announement completed');
      this.postingForm.reset();
      this.router.navigate(['./pages/documents_amendment/']);
    })
    .catch(error => {
      console.log(JSON.stringify(error));
      this.toastr.danger('error','Make an announement failed');
    });
  }

  edit(event: any): void{
    console.log('event edit', event);
    if(this.postingForm.value.body == (event as string))
      return;
    
    this.postingForm.value.body = event as string;
  }

  getDiffDate(endDate: string, effectiveDate: string): number{
    let stop = new Date(endDate).valueOf();
    let start = new Date(effectiveDate).valueOf();

    return stop - start;
  }

}
