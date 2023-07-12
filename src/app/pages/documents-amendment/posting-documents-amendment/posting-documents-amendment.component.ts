import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { roleOptions } from '../../../../environments/myconfigs';
import { AnnouncementService } from '../../../@core/shared/services/announcement.service';
import { Announcement } from '../../../@core/shared/interfaces/announcement';
import { NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { FirestoreUserService } from '../../../@core/shared/services/firestore-user.service';

@Component({
  selector: 'ngx-posting-documents-amendment',
  templateUrl: './posting-documents-amendment.component.html',
  styleUrls: ['./posting-documents-amendment.component.scss']
})
export class PostingDocumentsAmendmentComponent implements OnInit, OnDestroy {
  @Input() myInput: string;

  postingForm: FormGroup;

  audienceGroups = roleOptions;
  endDateSubscription: any;
  effectiveDateSubscription: any;
  diffDateSubscription: any;

  diffDate: number;

  constructor(private formBuilder: FormBuilder, private toastr: NbToastrService, private announcementService: AnnouncementService, private router: Router, private firestoreUserService: FirestoreUserService) { }

  ngOnInit(): void {
    
    this.postingForm = this.formBuilder.group({
      author: ['', Validators.required],
      code: ['', Validators.required],
      title: ['', Validators.required],
      body: [' ', Validators.required],
      publishedDate: ['', Validators.required],
      effectiveDate: ['', Validators.required],
      endDate: ['', Validators.required],
      acknowledge: ['Yes', Validators.required],
      audience: [[this.firestoreUserService.getFirestoreUser().role], Validators.required]
    });    

    this.effectiveDateSubscription = (this.postingForm.get('publishedDate') as FormControl).valueChanges.subscribe(value => this.validateEffectiveDate());
    this.endDateSubscription = (this.postingForm.get('effectiveDate') as FormControl).valueChanges.subscribe(value => this.validateEndDate());
    this.diffDateSubscription = (this.postingForm.get('endDate') as FormControl).valueChanges.subscribe(value => this.calDiffDate());
  }

  calDiffDate(): void {
    const effectiveDate = new Date(this.postingForm.get('effectiveDate').value).valueOf();
    const endDate = new Date(this.postingForm.get('endDate').value).valueOf(); 

    if(endDate >= effectiveDate)
      this.diffDate = (endDate - effectiveDate)/(1000 * 60 * 60 * 24);
    else
      this.diffDate = 0;
  }

  ngOnDestroy(): void {
    if(this.endDateSubscription)
      this.endDateSubscription.unsubscribe();

    if(this.effectiveDateSubscription)
      this.effectiveDateSubscription.unsubscribe();

    if(this.diffDateSubscription)
      this.diffDateSubscription.unsubscribe();
  }

  validateEndDate(): void {
    const effectiveDate = new Date(this.postingForm.get('effectiveDate').value).valueOf();
    const endDate = new Date(this.postingForm.get('endDate').value).valueOf(); 

    if(endDate < effectiveDate)
      this.postingForm.get('endDate').setValue('');    
  }

  validateEffectiveDate(): void {
    const publishedDate = new Date(this.postingForm.get('publishedDate').value).valueOf();
    const effectiveDate = new Date(this.postingForm.get('effectiveDate').value).valueOf();

    if(effectiveDate < publishedDate)
      this.postingForm.get('effectiveDate').setValue('');
  }

  onSubmit() {
    // Process form data here
    // console.log(this.postingForm.value);
    const temp = {...this.postingForm.value, signatures:[]} as Announcement;
    this.announcementService.addAnnouncement(temp).then(()=>{
      this.toastr.primary('Completed','Make an announement completed');
      this.postingForm.reset();
      this.router.navigate(['./pages/documents_amendment/']);
    })
    .catch(error => {
      // console.log(JSON.stringify(error));
      this.toastr.danger('error','Make an announement failed');
    });
  }

  edit(event: any): void{
    // console.log('event edit', event);
    if(this.postingForm.value.body == (event as string))
      return;
    
    this.postingForm.get('body').setValue(event as string);
  }

  getDiffDate(endDate: string, effectiveDate: string): number{
    let stop = new Date(endDate).valueOf();
    let start = new Date(effectiveDate).valueOf();

    return stop - start;
  }

}
