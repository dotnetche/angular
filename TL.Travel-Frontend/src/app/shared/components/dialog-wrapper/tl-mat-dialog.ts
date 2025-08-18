import { Injectable } from '@angular/core';
import { DialogPosition, MatDialog, MatDialogRef, MatDialogState } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { DialogWrapperComponent } from './dialog-wrapper.component';
import { IDialogComponent } from './interfaces/dialog-content.interface';
import { IDialogData } from './interfaces/dialog-data.interface';

@Injectable({
    providedIn: 'root'
})
export class TLMatDialog<T extends IDialogComponent> {
    constructor(private dialog: MatDialog) { }

    public open(data: IDialogData<T>, dialogWidth: string = '1600px'): Observable<any> {
        const dialogRef = this.dialog.open<DialogWrapperComponent<T>, IDialogData<T>, any>(DialogWrapperComponent, {
            width: dialogWidth,
            data
        });

        return new TLMatDialogRef<T>(dialogRef).afterClosed();
    }

    public openWithTwoButtons(data: IDialogData<T>, dialogWidth: string = '1600px', dialogHeight: string = 'auto', minHeight?: string): Observable<any> {
        if (data.saveBtn == undefined) {
            data.saveBtn = {
                id: 'save-button-id',
                translateValue: data.translteService.getValue('common.save'),
                color: 'accent'
            };
        }

        if (data.cancelBtn == undefined) {
            data.cancelBtn = {
                id: 'cancel-button-id',
                translateValue: data.translteService.getValue('common.cancel'),
                color: 'primary'
            };
        }

        const dialogRef = this.dialog.open<DialogWrapperComponent<T>, IDialogData<T>, any>(DialogWrapperComponent, {
            width: dialogWidth,
            height: dialogHeight,
            minHeight: minHeight,
            data
        });

        return new TLMatDialogRef<T>(dialogRef).afterClosed();
    }
}

@Injectable({
    providedIn: 'root'
})
export class TLMatDialogRef<T extends IDialogComponent>
{
    private matDialogRef: MatDialogRef<DialogWrapperComponent<T>, any>;

    public constructor(matDialogRef: MatDialogRef<DialogWrapperComponent<T>, any>) {
        this.matDialogRef = matDialogRef;
    }

    public close(dialogResult?: any): void {
        this.matDialogRef.close(dialogResult);
    }

    public afterOpened(): Observable<void> {
        return this.matDialogRef.afterOpened();
    }


    public afterClosed(): Observable<any | undefined> {
        return this.matDialogRef.afterClosed();
    }


    public beforeClosed(): Observable<any | undefined> {
        return this.matDialogRef.beforeClosed();
    }

    public backdropClick(): Observable<MouseEvent> {
        return this.matDialogRef.backdropClick();
    }

    public keydownEvents(): Observable<KeyboardEvent> {
        return this.matDialogRef.keydownEvents();
    }


    public updatePosition(position?: DialogPosition): this {
        this.matDialogRef.updatePosition(position);
        return this;
    }

    public updateSize(width?: string, height?: string): this {
        this.matDialogRef.updateSize(width, height);

        return this;
    }

    public addPanelClass(classes: string | string[]): this {
        this.matDialogRef.addPanelClass(classes);
        return this;
    }


    public removePanelClass(classes: string | string[]): this {
        this.matDialogRef.addPanelClass(classes);
        return this;
    }

    public getState(): MatDialogState {
        return this.matDialogRef.getState();
    }

    public expandFullScreen() {
        this.matDialogRef.componentInstance.expandFullScreen();
    }

    public collapseFullScreen() {
        this.matDialogRef.componentInstance.collapseFullScreen();
    }

}