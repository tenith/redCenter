import { Component, OnInit } from '@angular/core';
import { VrService } from '../../../@core/shared/services/vr.service';
import { VrDetail } from '../../../@core/shared/interfaces/vr-detail';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-vr-listconfirmation',
  templateUrl: './vr-listconfirmation.component.html',
  styleUrls: ['./vr-listconfirmation.component.scss']
})
export class VrListconfirmationComponent implements OnInit {

  vrList: VrDetail[];
  constructor(private vrService: VrService, private dialogRef: NbDialogRef<VrListconfirmationComponent>) { }

  ngOnInit(): void {
    // this.vrService.getMyVR().then(data => {
    //   this.vrList = data;
    //   console.log(JSON.stringify(this.vrList));
    // });
    this.vrService.getMyVR().subscribe(data => {
      this.vrList = [...data];      
    });
  }

  getFlightsFormat(vr: VrDetail): string {
    let temp = '';
    for(let i=0;i<vr.flights.length;i++){
      if(i!=0)
        temp = temp + "-"
      temp = temp + "FD" + vr.flights[i].fltNO;
    }

    return temp;
  }

  selectVR(VrDetail: VrDetail): void {
    this.dialogRef.close(JSON.stringify(VrDetail));
  }

  cancel(): void {
    this.dialogRef.close('');
  }

}
