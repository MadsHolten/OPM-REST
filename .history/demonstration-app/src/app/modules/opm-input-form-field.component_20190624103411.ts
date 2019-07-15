import { Component, forwardRef, Input, OnChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';

import { DialogHistoryComponent } from './dialog-history.component';

import { OPMInputFormFieldService } from './opm-input-form-field.service';

import { RDFLiteral } from './opm-input-form-field.models';

@Component({
  selector: 'opm-input-form-field',
  templateUrl: './opm-input-form-field.component.html',
  styleUrls: ['./opm-input-form-field.component.css'],
  providers: [ {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => OPMInputFormFieldComponent),
        multi: true
    },
    {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => OPMInputFormFieldComponent),
        multi: true
    } ]
})
export class OPMInputFormFieldComponent implements ControlValueAccessor, OnChanges {

    public initialValue: string;
    public currentValue;
    public allStates;

    public onChange: (_: any) => void;
    public onTouched: () => void;
    public disabled: boolean;
    public fieldController: FormControl;

    @Input() placeholder: string;                           // Placeholder text that describes the field
    @Input() hintMessage: string;                           // OPTIONAL Hint text message
    @Input() errorMessage: string;                          // OPTIONAL Error text message
    @Input() propertyURI: string;                           // OPTIONAL URI of existing property - in create situations none will be given
    @Input() type: string = 'text';                         // OPTIONAL input type (defaults to 'text')

    public historyCount: number;

    constructor(
        private _s: OPMInputFormFieldService,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar
    ){}

    ngOnChanges(){
        this.getPropertyValue();
    }

    getPropertyValue(){
        if(this.propertyURI){
            this._s.getProperty(this.propertyURI).subscribe(res => {
                // Get current state and history count
                const obj = res[0];
                    var states = obj.hasPropertyState;

                    // Convert to array if it is not already an array
                    if(states.length == undefined) states = [states];

                    // Save history count
                    this.historyCount = states.length;

                    // Get current state
                    var currentState = states.find(state => state['@type'].includes('opm:CurrentPropertyState'));

                    // Save all states
                    this.allStates = states;

                    // Save initial value and current value
                    this.initialValue = currentState.value;
                    this.currentValue = currentState.value;

            }, err => console.log(err))
            this.currentValue = 'value'
        }
    }

    validate(c: FormControl){
        this.fieldController = c;

        // Add astrisk if field is required
        if(c.errors && c.errors.required){
            if(!this.placeholder.endsWith('*')) this.placeholder+= '*';
        }
    }

    writeValue(value: string): void {
        // this.currentValue = value ? value : '';
        // this.initialValue = value ? value : '';
    }

    // Fired when value is changed
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onShowHistory(){
        let dialogRef = this.dialog.open(DialogHistoryComponent, {
            height: '300px',
            width: '500px',
            data: this.allStates
        });
    }

    onResetProperty(){
        this.currentValue = this.initialValue;
    }

    onUpdateProperty(){
        if(this.propertyURI){

            // Parse value to RDF literal
            var val = new RDFLiteral(this.currentValue);

            // Update the property
            this._s.updateProperty(this.propertyURI, val).subscribe(res => {
                this.initialValue = this.currentValue;     // Update initial value to the updated property value
                this.historyCount++;                       // Increment history count by 1

                // Get property history from OPM-REST
                this.getPropertyValue();

                console.log(`opm-input-form-field updated property ${this.propertyURI} to "${this.currentValue}"`);
            }, err => {
                // Revert to initial value
                this.currentValue = this.initialValue;
                this._snackBar.open("Could not write to AEC-KG", "OK", { duration: 2000 });
                console.log(err);
            });

        }
    }

}