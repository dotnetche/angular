import { AfterViewInit, Component, ComponentRef, ElementRef, Inject, OnDestroy, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatToolbarRow } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { SimpleAuditDTO } from 'app/models/common/simple-audit.model';
import { ITranslateService } from 'app/shared/interfaces/translate-service.interface';
import { CommonUtils } from 'app/shared/utils/common.utils';
import { IActionInfo } from './interfaces/action-info.interface';
import { IDialogComponent } from './interfaces/dialog-content.interface';
import { IDialogData } from './interfaces/dialog-data.interface';
import { IHeaderAuditButton } from './interfaces/header-audit-button.interface';
import { IHeaderCancelButton } from './interfaces/header-cancel-button.interface';
import { DialogWrapperData } from './models/dialog-action-buttons.model';
@Component({
    selector: 'dialog-wrapper',
    templateUrl: './dialog-wrapper.component.html',
    styleUrls: ['./dialog-wrapper.component.scss']
})
export class DialogWrapperComponent<T extends IDialogComponent> implements AfterViewInit, OnDestroy {
    public readonly MAT_ICON_SIZE: number = CommonUtils.MAT_ICON_SIZE;
    public title: string = '';
    public headerTooltip: string = 'Close dialog';
    public headerCloseButtonTooltip: string = '';
    public headerAuditButtonTooltip: string = '';
    public showHeaderCloseBtn: boolean = true;
    public showHeaderAuditBtn: boolean = true;
    public headerCancelButton: IHeaderCancelButton | undefined;
    public leftSideActionsCollection: Array<IActionInfo> = new Array<IActionInfo>();
    public rightSideActionsCollection: Array<IActionInfo> = new Array<IActionInfo>();
    public saveBtn?: IActionInfo;
    public auditInfo: SimpleAuditDTO | undefined;
    public cancelBtn?: IActionInfo;
    public closeBtn?: IActionInfo;
    public headerAuditBtn: IHeaderAuditButton | undefined;
    public viewMode: boolean = false;
    public draggable: boolean = true;
    public resizable: string = '';
    public defaultFullscreen: boolean = false;

    @ViewChild('placeHolder', { read: ViewContainerRef })
    private _placeHolder: ViewContainerRef | undefined;

    @ViewChild(MatToolbarRow, { read: ElementRef })
    private toolbarRow!: ElementRef;

    @ViewChild(MatDialogContent, { read: ElementRef })
    private dialogContent!: ElementRef;

    @ViewChild(MatDialogActions, { read: ElementRef })
    private dialogActions!: ElementRef;

    // dragging
    private dragHandle!: HTMLElement;
    private isHandleGrabbed: boolean = false;
    private overlayOffset: number[] = [0, 0];
    private mousePosition!: DOMPoint;

    // resizing
    private containerElement!: HTMLElement;
    private overlayElement!: HTMLElement;
    private contentElement!: HTMLElement;
    private actionsElement!: HTMLElement;
    private resizeHandles!: Map<string, HTMLDivElement>;
    private resizeHandleEvents!: Map<string, (mouseEvent: MouseEvent) => void>;
    private overlayWidth!: string;
    private overlayHeight!: string;
    private overlayTop!: string;
    private overlayLeft!: string;
    private isOverlayFullScreen: boolean = false;

    private translate!: ITranslateService;
    private componentCtor: (new (...args: any[]) => T) | undefined;
    private componentData: any | undefined;
    private componentInstance!: T;
    private router!: Router;

    constructor(
        public dialogRef: MatDialogRef<DialogWrapperComponent<T>>,
        @Inject(MAT_DIALOG_DATA)
        data: IDialogData<T>,
        router: Router
    ) {
        if (data != undefined) {
            this.title = data.title;
            this.translate = data.translteService;
            this.headerCloseButtonTooltip = this.translate.getValue('common.close');
            this.headerAuditButtonTooltip = this.translate.getValue('common.simple-audit-info');
            this.componentData = data.componentData;
            this.componentCtor = data.TCtor;
            this.saveBtn = data.saveBtn;
            this.cancelBtn = data.cancelBtn;
            this.draggable = data.draggable ?? true;
            this.resizable = data.resizable ?? 'u d l r ul ur dl dr f';
            this.defaultFullscreen = data.defaultFullscreen ?? false;
            this.router = router;

            this.viewMode = data.viewMode ?? false;
            this.closeBtn = data.closeBtn ?? {
                id: 'close',
                color: 'primary',
                translateValue: 'common.close'
            };

            if (data.disableDialogClose !== undefined) {
                dialogRef.disableClose = data.disableDialogClose;
            } else {
                dialogRef.disableClose = true;
            }

            if (data.leftSideActionsCollection !== undefined) {
                this.leftSideActionsCollection = data.leftSideActionsCollection;
            }

            if (data.rightSideActionsCollection !== undefined) {
                this.rightSideActionsCollection = data.rightSideActionsCollection;
            }

            if (!this.isNullOrUndefined(data.headerCancelButton)) {
                this.showHeaderCloseBtn = true;
                this.headerCancelButton = data.headerCancelButton;
                if (!this.isNullOrUndefined(data?.headerCancelButton?.tooltip)) {
                    this.headerCloseButtonTooltip = data?.headerCancelButton?.tooltip as string;
                }
            } else {
                this.showHeaderCloseBtn = false;
            }

            if (!this.isNullOrUndefined(data.headerAuditButton)) {
                this.headerAuditBtn = data.headerAuditButton;
                this.showHeaderAuditBtn = true;
                if (!this.isNullOrUndefined(data?.headerAuditButton?.tooltip)) {
                    this.headerAuditButtonTooltip = data?.headerAuditButton?.tooltip as string;
                }
            } else {
                this.showHeaderAuditBtn = false;
            }
        }
    }

    public ngAfterViewInit(): void {
        const type = (this.componentCtor as Type<T>);
        const component = this.createComponent((this._placeHolder as unknown as ViewContainerRef), type);
        this.componentInstance = component.instance;
        // all inputs/outputs set? add it to the DOM ..
        setTimeout(() => {
            this.placeholder.insert(component.hostView);
        });

        this.dragHandle = this.getDragHandle();
        this.containerElement = this.getContainerElement();
        this.overlayElement = this.getOverlayElement();
        this.contentElement = this.getContentElement();
        this.actionsElement = this.getActionsElement();

        this.setStyles();

        if (this.draggable) {
            this.subscribeDragEvents();
        }

        if (this.isResizable()) {
            this.subscribeResizeEvents();
        }

        if (this.defaultFullscreen === true) {
            this.toggleFullScreen(undefined);
        }
    }

    public ngOnDestroy(): void {
        if (this.draggable) {
            this.unsubscribeDragEvents();
        }

        if (this.isResizable()) {
            this.unsubscribeResizeEvents();
        }
    }

    public closeDialog(actionInfo: IActionInfo | undefined): void {
        if (actionInfo === undefined) {
            this.dialogRef.close();
        } else {
            this.componentInstance.dialogButtonClicked(actionInfo, this.dialogRef.close.bind(this.dialogRef));
        }
    }

    public cancelBtnClicked(actionInfo: IActionInfo): void {
        this.componentInstance.cancelBtnClicked(actionInfo, this.dialogRef.close.bind(this.dialogRef));
    }

    public saveBtnClicked(actionInfo: IActionInfo): void {
        this.componentInstance.saveBtnClicked(actionInfo, this.dialogRef.close.bind(this.dialogRef));
    }

    public closeBtnClicked(actionInfo: IActionInfo): void {
        if (this.componentInstance.closeBtnClicked) {
            this.componentInstance.closeBtnClicked(actionInfo, this.dialogRef.close.bind(this.dialogRef));
        }
        else {
            this.dialogRef.close();
        }
    }

    public headerCloseDialog(actionInfo: IHeaderCancelButton | undefined): void {
        if (actionInfo === undefined) {
            this.dialogRef.close(false);
        } else {
            actionInfo.cancelBtnClicked(this.dialogRef.close.bind(this.dialogRef));
        }
    }

    public headerAuditBtnClicked(): void {
        if (this.headerAuditBtn !== undefined) {
            this.headerAuditBtn.getAuditRecordData(this.headerAuditBtn.id).subscribe(result => {
                this.auditInfo = result;
            });
        }
    }

    public headerDetailedAuditBtnClicked(): void {
        const systemLogId: number | undefined = this.headerAuditBtn?.id;
        const systemLogTableName: string | undefined = this.headerAuditBtn?.tableName;

        if (systemLogId !== undefined &&
            !CommonUtils.isNumberNullOrNaN(systemLogId) &&
            !CommonUtils.isNullOrUndefined(systemLogTableName)) {
            this.router.navigateByUrl('/system-log', { state: { tableId: systemLogId!.toString(), tableName: systemLogTableName } });
        }

        this.dialogRef.close();
    }

    public get placeholder(): ViewContainerRef {
        return (this._placeHolder as unknown as ViewContainerRef);
    }

    private createComponent(viewContainerRef: ViewContainerRef, type: Type<T>): ComponentRef<T> {
        const component = viewContainerRef.createComponent(type);

        const dialogActionButtons = new DialogWrapperData({
            leftSideActions: this.leftSideActionsCollection,
            rightSideActions: this.rightSideActionsCollection,
            dialogRef: this.dialogRef
        });

        component.instance.setData(this.componentData, dialogActionButtons);

        return component;
    }

    private subscribeDragEvents(): void {
        this.dragHandle.addEventListener('mousedown', this.onDragHandleMousedown, true);
        this.dragHandle.addEventListener('mouseup', this.onDragHandleMouseup, true);
        document.addEventListener('mousemove', this.onDragHandleMouseMove, true);
    }

    private unsubscribeDragEvents(): void {
        this.dragHandle.removeEventListener('mousedown', this.onDragHandleMousedown, true);
        this.dragHandle.removeEventListener('mouseup', this.onDragHandleMouseup, true);
        document.removeEventListener('mousemove', this.onDragHandleMouseMove, true);
    }

    private onDragHandleMousedown = (mouseEvent: MouseEvent): void => {
        this.dragHandle.classList.add('grabbed');

        this.isHandleGrabbed = true;
        this.overlayOffset = [
            this.overlayElement.offsetLeft - mouseEvent.clientX,
            this.overlayElement.offsetTop - mouseEvent.clientY
        ];
    };

    private onDragHandleMouseup = (): void => {
        this.dragHandle.classList.remove('grabbed');

        this.isHandleGrabbed = false;
    };

    private onDragHandleMouseMove = (mouseEvent: MouseEvent): void => {
        if (this.isHandleGrabbed) {
            mouseEvent.preventDefault();

            this.mousePosition = new DOMPoint(mouseEvent.clientX, mouseEvent.clientY);

            this.overlayElement.style.position = 'absolute';
            this.overlayElement.style.top = (this.mousePosition.y + this.overlayOffset[1]) + 'px';
            this.overlayElement.style.left = (this.mousePosition.x + this.overlayOffset[0]) + 'px';

            this.overlayTop = this.overlayElement.style.top;
            this.overlayLeft = this.overlayElement.style.left;
        }
    };

    private getDragHandle(): HTMLElement {
        return this.toolbarRow.nativeElement as HTMLElement;
    }

    private subscribeResizeEvents(): void {
        this.containerElement.style.position = 'relative';
        this.containerElement.style.overflow = 'hidden';

        this.resizeHandles = new Map<string, HTMLDivElement>();
        this.resizeHandleEvents = new Map<string, (mouseEvent: MouseEvent) => void>();

        for (const side of this.resizable.split(' ')) {
            this.createResizeHandle(side);
        }
    }

    private unsubscribeResizeEvents(): void {
        for (const [side, event] of this.resizeHandleEvents) {
            if (side === 'f') {
                this.dragHandle.removeEventListener('dblclick', this.toggleFullScreen, false);
            }
            else {
                this.resizeHandles.get(side)!.removeEventListener('mousedown', event, false);
            }
        }
    }

    private createResizeHandle(side: string): void {
        if (side === 'f') {
            this.overlayWidth = this.overlayElement.style.width;
            this.overlayHeight = this.overlayElement.style.height;
            this.overlayTop = this.overlayElement.style.top;
            this.overlayLeft = this.overlayElement.style.left;

            this.dragHandle.addEventListener('dblclick', this.toggleFullScreen, false);
            this.resizeHandleEvents.set(side, this.toggleFullScreen);
        }
        else {
            const handle: HTMLDivElement = document.createElement('div');
            handle.className = `resize-handle-${side}`;

            const event: (mouseEvent: MouseEvent) => void = this.startResizeDrag(side);
            handle.addEventListener('mousedown', event, false);

            this.containerElement.appendChild(handle);
            this.resizeHandles.set(side, handle);
            this.resizeHandleEvents.set(side, event);
        }
    }

    private startResizeDrag(side: string): (mouseEvent: MouseEvent) => void {
        return (mouseEvent: MouseEvent): void => {
            mouseEvent.preventDefault();

            const startHeight: number = this.containerElement.clientHeight;
            const startWidth: number = this.containerElement.clientWidth;

            const mouseDragHandler = (pointerEvent: PointerEvent) => {
                pointerEvent.preventDefault();

                if (pointerEvent.buttons !== 1) {
                    document.body.removeEventListener('pointermove', mouseDragHandler);
                }
                else {
                    this.overlayElement.style.position = 'absolute';

                    if (side === 'u' || side === 'ul' || side === 'ur') {
                        const newHeight: number = startHeight + (mouseEvent.clientY - pointerEvent.pageY);
                        this.overlayElement.style.top = `${pointerEvent.pageY}px`;
                        this.overlayElement.style.height = `${newHeight}px`;
                        this.overlayElement.style.maxHeight = `${newHeight}px`;
                    }

                    if (side === 'd' || side == 'dl' || side === 'dr') {
                        const newHeight: number = startHeight + (pointerEvent.pageY - mouseEvent.clientY);
                        this.overlayElement.style.bottom = `${window.innerHeight - 8 - pointerEvent.pageY}px`;
                        this.overlayElement.style.height = `${newHeight}px`;
                        this.overlayElement.style.maxHeight = `${newHeight}px`;
                    }

                    if (side === 'l' || side === 'ul' || side === 'dl') {
                        const newWidth: number = startWidth + (mouseEvent.clientX - pointerEvent.pageX);
                        this.overlayElement.style.left = `${pointerEvent.pageX}px`;
                        this.overlayElement.style.width = `${newWidth}px`;
                        this.overlayElement.style.maxWidth = `${newWidth}px`;
                    }

                    if (side === 'r' || side === 'ur' || side === 'dr') {
                        const newWidth: number = startWidth + (pointerEvent.pageX - mouseEvent.clientX);
                        this.overlayElement.style.right = `${window.innerWidth - 8 - pointerEvent.pageX}px`;
                        this.overlayElement.style.width = `${newWidth}px`;
                        this.overlayElement.style.maxWidth = `${newWidth}px`;
                    }

                    this.overlayWidth = this.overlayElement.style.width;
                    this.overlayHeight = this.overlayElement.style.height;
                }
            };

            document.body.addEventListener('pointermove', mouseDragHandler);
        };
    }

    private toggleFullScreen(event: MouseEvent | undefined): void {
        if (this.isOverlayFullScreen) {
            this.isOverlayFullScreen = false;

            this.collapseFullScreen();
        }
        else {
            this.isOverlayFullScreen = true;

            this.expandFullScreen();
        }
    }

    public expandFullScreen() {
        this.overlayElement.style.top = '0';
        this.overlayElement.style.left = '0';
        this.overlayElement.style.maxWidth = '100%';
        this.overlayElement.style.maxHeight = '100%';
        this.overlayElement.style.width = '100%';
        this.overlayElement.style.height = '100%';
    }

    public collapseFullScreen() {
        this.overlayElement.style.width = this.overlayWidth;
        this.overlayElement.style.height = this.overlayHeight;
        this.overlayElement.style.top = this.overlayTop;
        this.overlayElement.style.left = this.overlayLeft;
    }

    private getContentElement(): HTMLElement {
        return this.dialogContent.nativeElement;
    }

    private getContainerElement(): HTMLElement {
        const content: HTMLElement = this.getContentElement();
        return this.getParentHTMLElement(content, 'mat-dialog-container');
    }

    private getOverlayElement(): HTMLElement {
        const overlay: HTMLElement = this.containerElement.parentElement!;
        return overlay;
    }

    private getActionsElement(): HTMLElement {
        return this.dialogActions.nativeElement;
    }

    private setStyles(): void {
        this.overlayElement.style.maxHeight = '95vh';

        this.containerElement.style.height = 'unset';
        this.containerElement.style.maxHeight = 'inherit';

        this.contentElement.style.height = '100%';
        this.contentElement.style.maxHeight = 'inherit';

        this.actionsElement.style.position = 'sticky';
        this.actionsElement.style.bottom = '0';
        this.actionsElement.style.backgroundColor = 'white';
        this.actionsElement.style.height = 'fit-content';
        this.actionsElement.style.minHeight = 'fit-content';
        this.actionsElement.style.transform = 'translateY(15px)';
    }

    private getParentHTMLElement(child: HTMLElement, tagName: string): HTMLElement {
        let result: HTMLElement = child.parentElement!;

        while (result.localName !== tagName) {
            result = result.parentElement!;
        }

        return result;
    }

    private isResizable(): boolean {
        return this.resizable !== undefined
            && this.resizable !== null
            && (this.resizable.includes('u')
                || this.resizable.includes('d')
                || this.resizable.includes('l')
                || this.resizable.includes('r'));
    }

    private isNullOrUndefined(value: any): boolean {
        if (value === null || value === undefined) {
            return true;
        }
        else {
            return false;
        }
    }
}