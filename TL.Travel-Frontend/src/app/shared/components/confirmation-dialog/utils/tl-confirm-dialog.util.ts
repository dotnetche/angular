import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfirmationDialogComponent } from '../confirmation-dialog.component';
import { IConfirmDialogData } from '../interfaces/confirmation-dialog-data.interface';

@Injectable({
    providedIn: 'root'
})
export class TLConfirmDialog {
    private dialog: MatDialog;

    public constructor(dialog: MatDialog) { 
        this.dialog = dialog;
    }

    public open(data?: IConfirmDialogData): Observable<boolean> {
        const dialogRef = this.dialog.open<ConfirmationDialogComponent, IConfirmDialogData, boolean>(ConfirmationDialogComponent, {
            minWidth: '350px',
            data
        });

        return dialogRef.afterClosed().pipe(map(result => {
            if (result === undefined || result === null) {
                return false;
            } else {
                return result;
            }
        }));
    }
}