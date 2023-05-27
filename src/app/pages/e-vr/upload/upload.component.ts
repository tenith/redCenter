import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';
import { VrDetail, defaultVR } from '../../../@core/shared/interfaces/vr-detail';
import * as uuid from 'uuid';
import { VrService } from '../../../@core/shared/services/vr.service';

@Component({
  selector: 'ngx-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  file: File | undefined;
  
  constructor(private datePipe: DatePipe, private vrService: VrService) { }

  ngOnInit(): void {
  }

  onFileChange(event: any) {
    this.file = event.target.files[0];
  }

  private extractValueByKey(data: string, startKey: string, endKey: string): string {
    const startIndex = data.indexOf(startKey) + startKey.length;
    const endIndex = data.indexOf(endKey, startIndex);
  
    return data.substring(startIndex, endIndex).replace(/&nbsp;/g, " ").replace(/,/g, "");
  }

  private changeDateFormat(oldDate: string): string {
    const oldFormat = 'DD/MM/YY';
    const newFormat = 'DD MMM YYYY';

    const parsedDate = moment(oldDate, oldFormat).toDate();
    const newDateString = moment(parsedDate).format(newFormat);

    return newDateString || '';
  }

  reviseData(data: string, key: string): string {
    const temp = data.substring(data.indexOf(key) + key.length);
    return temp.substring(temp.indexOf('</td>') + '</td>'.length);
  }

  private revisedTime(time: string): string {
    if (time.trim().length == 4) {
      return '0' + time.trim();
    }
    
    return time;
  }

  uploadFile(): void {

    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      const lines = fileReader.result.toString().split('\n');
      
      let crewChecked = false;
      let flightChecked = false;

      let tempVR: VrDetail = {...defaultVR};

      for (let i = 0; i < lines.length; i++) {
        let data = lines[i];      
  
        if (data.includes('name="PageN')) {        
          tempVR = {...defaultVR};
          tempVR.crewsId = [];
          tempVR.crews = [];
          tempVR.flights = [];
          tempVR.uuid = uuid.v4();
          continue;
        }
  
        if (data.includes('<td colspan="18" rowspan="2" class="s18">Version:&nbsp;18/01')) {
          // console.log(JSON.stringify(tempVR));
          this.vrService.saveVR(tempVR);

          tempVR = {...defaultVR};
          tempVR.crewsId = [];
          tempVR.crews = [];
          tempVR.flights = [];
          tempVR.uuid = uuid.v4();

          continue;
        }
  
        if (data.includes('LOCAL&nbsp;DATE:')) {
          tempVR.date = this.changeDateFormat(this.extractValueByKey(data, '<td colspan="6" rowspan="3" class="s6">', '</td>'));
        }
  
        if (data.includes('AIMS&nbsp;ID')) {
          crewChecked = true;
          flightChecked = false;
        }
  
        if (data.includes('All&nbsp;Time&nbsp;in&nbsp;UTC')) {
          crewChecked = false;
          flightChecked = true;
        }
  
        if (crewChecked && data.includes('<td colspan="3" class="s31">')) {
          const id = this.extractValueByKey(data, '<td colspan="6" class="s32">', '</td>');
          data = this.reviseData(data, "<td colspan=\"6\" class=\"s32\">");
          if(id.length != 7)
            continue;
          
          const position = this.extractValueByKey(data, '<td colspan="6" class="s32">', '</td>');
          const name = this.extractValueByKey(data, '<td colspan="43" class="s33">', '</td>');
          const reportTime = this.revisedTime(this.extractValueByKey(data, '<td colspan="10" class="s32">', '</td>'));
            
          tempVR.crewsId.push(id);
          tempVR.crews.push({id: id, position: position, name: name, report: reportTime});
          continue;
        }
  
        if (flightChecked && data.includes('<td colspan="2" class="s32">')) {
          const flightNumber = this.extractValueByKey(data, '<td colspan="2" class="s32">', '</td>');
          data = this.reviseData(data, "<td colspan=\"2\" class=\"s32\">");
					if(flightNumber.includes(">") || flightNumber.length == 0)
						continue;

          const registration = this.extractValueByKey(data, '>', '</td>');
          data = this.reviseData(data, ">");

          const from = this.extractValueByKey(data, '>', '</td>');
          data = this.reviseData(data, ">");

          const to = this.extractValueByKey(data, '>', '</td>');
          data = this.reviseData(data, ">");

          const std = this.revisedTime(this.extractValueByKey(data, '>', '</td>'));
          data = this.reviseData(data, ">");

          const sta = this.revisedTime(this.extractValueByKey(data, '>', '</td>'));
          data = this.reviseData(data, ">");

          const blk = this.revisedTime(this.extractValueByKey(data, '>', '</td>'));
          data = this.reviseData(data, ">");

          tempVR.flights.push({
            fltNO: flightNumber, registration: registration, from: from, to: to,
            std: std, sta: sta, blk: blk, 
            offChk: '', takeOff: '', landing: '', onChk: '', actBlk: '',
            PFId: '', uplift: '', burn: '',
            departureDelayTime1: '', departureDelayCode1: '', departureDelayTime2: '', departureDelayCode2: '', departureDelayTime3: '', departureDelayCode3: '',
            arrivalDelayTime1: '', arrivalDelayCode1: ''
          });          
        }
      }
    }
    fileReader.readAsText(this.file);
  }

}
