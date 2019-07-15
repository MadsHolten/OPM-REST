import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import * as _ from 'lodash';

@Component({
    selector: 'dialog-history',
    template: `
        <h4>Property subscribers</h4>
        <div *ngIf="subscribers && subscribers.length">
            <p *ngIf="subscribers.length == 1"><b>{{subscribers.length}}</b> property depends on this property</p>
            <p *ngIf="subscribers.length != 1"><b>{{subscribers.length}}</b> properties depend on this property</p>
            <p *ngFor="let item of subscribers">- {{item}}</p>
        </div>
        <p *ngIf="!subscribers || !subscribers.length">Property has no subscribers</p>`,
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

    public subscribers = [];

    constructor(
        public dialogRef: MatDialogRef<DialogSubscribersComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(){

        if(typeof this.data.hasSubscriber == 'string') {
            this.subscribers.push(this.data.hasSubscriber)
        }else{
            this.subscribers = this.data.hasSubscriber;
        }

    }

    // Close when clicking outside
    onNoClick(): void {
        this.dialogRef.close();
    }

}