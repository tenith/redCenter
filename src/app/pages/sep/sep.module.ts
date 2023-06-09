import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SepComponent } from './sep.component';

import { NbCardModule } from '@nebular/theme';
import { NbIconModule } from '@nebular/theme';
import { NbSpinnerModule } from '@nebular/theme';
import { NbButtonModule } from '@nebular/theme';

import { OneSepCardComponent } from './one-sep-card/one-sep-card.component';
import { AutolandCardComponent } from './autoland-card/autoland-card.component';

import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { DatePipe } from '@angular/common';

import { NbAccordionModule } from '@nebular/theme';
import { MandatoryCardPostComponent } from './mandatory-card-post/mandatory-card-post.component';

import { NbSelectModule } from '@nebular/theme';
import { NbInputModule } from '@nebular/theme';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';

@NgModule({
  declarations: [
    SepComponent,
    OneSepCardComponent,
    AutolandCardComponent,
    MandatoryCardPostComponent,
    DeleteConfirmationComponent,
  ],
  imports: [
    NbInputModule,
    CommonModule,
    NbCardModule,
    NbIconModule,
    NbSelectModule,
    NbSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    NbButtonModule,
    NbAccordionModule
  ],
  providers: [
    DatePipe
  ]
})
export class SepModule { }
