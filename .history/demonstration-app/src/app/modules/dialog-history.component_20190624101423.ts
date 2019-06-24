import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'dialog-history',
    template: `
        <h4>Property history</h4>
        <ul>
            <li *ngFor="let item of data">{{item['@type'] | json}} <span *ngIf="item['@type'].includes('opm:CurrentPropertyState')">current</span></li>
            
        </ul>`,
    styles: [`
        h4 {
            font-family: Roboto;
        }
        p {
            font-family: Roboto;
            font-size: 12px;
        }
    `]
})
export class DialogHistoryComponent {

    constructor(
        public dialogRef: MatDialogRef<DialogHistoryComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    // Close when clicking outside
    onNoClick(): void {
        this.dialogRef.close();
    }

}