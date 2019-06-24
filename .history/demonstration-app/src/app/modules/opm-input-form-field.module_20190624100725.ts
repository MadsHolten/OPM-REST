import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DialogHistoryComponent } from './dialog-history.component';
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
    DialogHistoryComponent
  ],
  exports: [
    OPMInputFormFieldComponent,
    DialogHistoryComponent
  ],
  entryComponents: [
    DialogHistoryComponent
  ],
  providers: [ OPMInputFormFieldService ]
})
export class OPMInputFormFieldModule { }