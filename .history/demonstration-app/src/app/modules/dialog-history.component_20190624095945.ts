import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'dialog-history',
    template: `<h4>Property history</h4>
    <p>{{data | json}}</p>`,
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
export class MessageDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<MessageDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    // Close when clicking outside
    onNoClick(): void {
        this.dialogRef.close();
    }

}