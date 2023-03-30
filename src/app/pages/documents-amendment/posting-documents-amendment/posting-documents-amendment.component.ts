import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { roleOptions } from '../../../@core/shared/interfaces/aoc-role-level';

@Component({
  selector: 'ngx-posting-documents-amendment',
  templateUrl: './posting-documents-amendment.component.html',
  styleUrls: ['./posting-documents-amendment.component.scss']
})
export class PostingDocumentsAmendmentComponent implements OnInit {
  @Input() myInput: string;

  postingForm: FormGroup;

  audienceGroups = roleOptions;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.postingForm = this.formBuilder.group({
      author: ['', Validators.required],
      code: ['', Validators.required],
      title: ['', Validators.required],
      body: ['', Validators.required],
      publishedDate: ['', Validators.required],
      effectiveDate: ['', Validators.required],
      endDate: ['', Validators.required],
      acknowledge: ['', Validators.required],
      audience: ['', Validators.required]
    });
  }

  onSubmit() {
    // Process form data here
    console.log(this.postingForm.value);
  }

}
