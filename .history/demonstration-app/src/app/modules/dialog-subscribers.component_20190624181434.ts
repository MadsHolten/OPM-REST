import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import * as _ from 'lodash';

@Component({
    selector: 'dialog-history',
    template: `
        <h4>Property subscribers</h4>
        <div *ngIf="data && data.hasSubscriber">
            <p>{{data.hasSubscriber.length}} properties depend on this property</p>
            <p>{{data | json}}</p>
        </div>
        <p *ngIf="!data || !data.hasSubscriber">Property has no subscribers</p>`,
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
export class DialogSubscribersComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<DialogSubscribersComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(){
        // this.data = _.orderBy(this.data, ['generatedAtTime'],['desc']);
    }

    // Close when clicking outside
    onNoClick(): void {
        this.dialogRef.close();
    }

}