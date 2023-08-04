import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TabService } from '../../../@core/shared/services/tab.service';
import { NbTabsetComponent } from '@nebular/theme';
import { Observable, Subscription } from 'rxjs';
import { ETS1Service } from '../../../@core/shared/services/e-ts1.service';

@Component({
  selector: 'ngx-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit, OnDestroy, AfterViewInit {
  activeUUID: string = '';
  uuidList: string[] = [];  

  private newTab$: Observable<any>;
  private newTabSub: Subscription;

  @ViewChild("tabSet") tabsetEl: NbTabsetComponent;

  constructor(private tabService: TabService, private cdr: ChangeDetectorRef, private eTS1Service: ETS1Service) { 
    this.uuidList = this.tabService.getViewUUIDTabs();
    this.newTab$ = this.tabService.getObservable();
  }

  ngAfterViewInit(): void {
    // this.reviseTab();
  }

  ngOnDestroy(): void {
    this.newTabSub.unsubscribe();
  }

  reviseTab(): void {    
    // let tempT = this.tabsetEl.tabs;
    // for(let i=1; i<tempT.length;i++){
    //   const tempUUID = tempT.get(i).tabTitle;
    //   if(tempUUID.split('-').length > 1){
    //     const temp = this.eTS1Service.geteTS1FromCacheByUUID(tempUUID);
    //     if(temp == null)
    //       return;
    //     tempT.get(i).tabTitle = temp.rank1 + ": " + temp.name1.split(' ')[0];
    //   }
    // }
    // this.cdr.detectChanges();
  }

  ngOnInit(): void { 
    this.newTabSub =  this.newTab$.subscribe(uuid => {
        this.gotoTab(uuid);
      });
  }

  addTab(uuid: string): void {
    this.uuidList.push(uuid);    
    this.tabService.addViewTab(uuid);
    // this.eTS1Service.neweTS1(uuid);
    this.cdr.detectChanges();
    this.gotoTab(uuid);
    // this.reviseTab();
  }

  gotoTab(uuid: string): void {
    let allTabs = this.tabsetEl.tabs;
    for(let i=0; i< this.tabsetEl.tabs.length;i++){
      if(allTabs.get(i).tabTitle == uuid){    
        this.tabsetEl.selectTab(allTabs.get(i));
        break;
      }
    }
  }

  removeTab(uuid: string): void {
    this.uuidList.filter(item => item!= uuid);
    this.tabService.removeViewTab(uuid);
  }

}
