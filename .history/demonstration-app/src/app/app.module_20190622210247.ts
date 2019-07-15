import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {  MatStepperModule, MatInputModule, 
          MatFormFieldModule, MatCardModule,
          MatExpansionModule, MatButtonModule,
          MatSlideToggleModule, MatTooltipModule,
          MatDividerModule } from '@angular/material';

import { AppService } from './app.service';
import { AppData } from './app.data';

import { CodemirrorModule } from 'ng2-codemirror';

import { Step1Component } from './step1.component';
import { Step2Component } from './step2.component';
import { Step3Component } from './step3.component';
import { Step4Component } from './step4.component';

import { OPMInputFormFieldModule } from './modules/opm-input-form-field.module';

@NgModule({
  declarations: [
    AppComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    MatStepperModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
    CodemirrorModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatDividerModule,
    OPMInputFormFieldModule
  ],
  providers: [
    AppService,
    AppData
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
