import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import * as _ from 'lodash';

@Component({
    selector: 'dialog-history',
    template: `
        <h4>Property history</h4>
        <ul>
            <li 
                *ngFor="let item of data">{{item.generatedAtTime | date:'medium'}} - <i><b>{{item.value}}</b></i>
                <span class="small" *ngIf="item['@type'].includes('opm:CurrentPropertyState')">  (current)</span>
                <span class="small" *ngIf="item['@type'].includes('opm:InitialPropertyState')">  (initial)</span>
            </li>
        </ul>`,
    styles: [`
        h4 {
            font-family: Roboto;
        }
        p {
            font-family: Roboto;
            font-size: 12px;
        }
        .small{
            font-size: 10px;
        }
    `]
})
export class DialogHistoryComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<DialogHistoryComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(){
        this.data = _.orderBy(this.data, ['generatedAtTime'],['desc']);
    }

    // Close when clicking outside
    onNoClick(): void {
        this.dialogRef.close();
    }

}