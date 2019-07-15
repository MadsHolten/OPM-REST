import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DialogHistoryComponent } from './dialog-history.component';
import { DialogSubscribersComponent } from './dialog-subscribers.component';
import { OPMInputFormFieldComponent } from './opm-input-form-field.component';

import { OPMInputFormFieldService } from './opm-input-form-field.service';

// Angular material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule,
         MatInputModule,
         MatFormFieldModule,
         MatDialogModule,
         MatButtonModule,
         MatSnackBarModule,
         MatTooltipModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  declarations: [
    OPMInputFormFieldComponent,
    DialogHistoryComponent,
    DialogSubscribersComponent
  ],
  exports: [
    OPMInputFormFieldComponent,
    DialogHistoryComponent,
    DialogSubscribersComponent
  ],
  entryComponents: [
    DialogHistoryComponent,
    DialogSubscribersComponent
  ],
  providers: [ OPMInputFormFieldService ]
})
export class OPMInputFormFieldModule { }
