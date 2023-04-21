import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FileReportService } from '../../../@core/shared/services/file-report.service';
import { LocalDataSource } from 'ng2-smart-table';
import { DatePipe } from '@angular/common';
import { CustomActionComponent } from '../custom-action/custom-action.component';
import { ReportComponent } from '../report/report.component';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-report-summary',
  templateUrl: './report-summary.component.html',
  styleUrls: ['./report-summary.component.scss']
})
export class ReportSummaryComponent implements OnInit {
  source: LocalDataSource;
  dialogRef: NbDialogRef<ReportComponent>;

  valid:boolean = false;

  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      display: true,
      perPage: 100
    },
    columns: {
      myCommand: { title:'Action & Status', width:'12%', type:'custom', filter: false, sort:false,renderComponent: CustomActionComponent},
      owner: { title: 'owner', filter: false, sort:false,},
      description: { title: 'Description', filter: false, sort:false,},
      name: { title: 'Name', filter: false, sort:false, valuePrepareFunction: (name) => {
        let temp = name.split('_')[1];
        return temp;
      }}
    },
  };

  downloadUrl$: Observable<any>;
  constructor(public toastr: NbToastrService, private dialogService: NbDialogService, private fileReportService: FileReportService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.downloadUrl$ = this.fileReportService.getObservable();
    this.downloadUrl$.subscribe(()=>{
      console.log('subscribe alert');
      this.refresh();
    });
  }

  refresh(): void {
    const temp = this.fileReportService.getReportInformation();
    this.source = new LocalDataSource([...temp]);

    if(temp.length > 0)
      this.valid = true;
    else  
      this.valid = false;
      
    this.cdr.detectChanges();
  }

  generateReport(): void{
    if(this.fileReportService.getReportInformation().length == 0){
      this.toastr.danger('Error','There is no document to be report, Please select at least one document to generate the report', {duration:5000});
      return;
    }
    
    this.dialogRef = this.dialogService.open(ReportComponent,{ hasScroll:true});
  }

}
