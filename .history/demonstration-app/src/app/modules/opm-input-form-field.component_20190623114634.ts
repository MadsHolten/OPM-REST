import { Component, forwardRef, Input, Output, OnInit, EventEmitter, OnChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, AbstractControl, FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar, MatInput } from '@angular/material';

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
export class OPMInputFormFieldComponent implements ControlValueAccessor, OnChanges, OnInit {

    public initialValue: string;
    public currentValue;

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

    ngOnInit(){
        console.log('Init');
        // Get value and history count

        
    }

    ngOnChanges(){
        if(this.historyCount == undefined) this.historyCount = 1;
        this.getPropertyValue();
    }

    getPropertyValue(){
        if(this.propertyURI){
            this._s.getProperty(this.propertyURI).subscribe(res => {
                // Get current state and history count
                const obj = res[0];
                    const states = obj.hasPropertyState;
                    if(typeof states == 'object'){
                        this.historyCount = 1;
                        this.initialValue = states;
                        this.currentValue = states;
                        console.log(states)
                    }
                    // states.forEach(state => {
                    //     console.log(state)
                    // })
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
        if(this.propertyURI) {
            this._s.getPropertyHistory(this.propertyURI).subscribe(tableData => {
                
                const title = `Property history`;
                console.log(tableData)
            
                // let dialogRef = this.dialog.open(DialogTableComponent, {
                //     panelClass: 'app-full-bleed-dialog', 
                //     width: '600px',
                //     height: '400px',
                //     data: td
                // });

            })
        }
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
                this.historyCount++;                // Increment history count by 1

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