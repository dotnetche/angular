import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from 'app/core/translation/translate.service';
import { HotelRoomDTO } from 'app/models/administration/hotel-room.model';
import { ClientsService } from 'app/services/administration/clients.service';
import { TLConfirmDialog } from 'app/shared/components/confirmation-dialog/utils/tl-confirm-dialog.util';
import { IRemoteTLDatatableComponent } from 'app/shared/components/data-table/interfaces/tl-remote-datatable.interface';
import { TLDataTableComponent } from 'app/shared/components/data-table/tl-data-table.component';
import { DialogParamsModel } from 'app/shared/components/dialog-wrapper/models/dialog-params.model';
import { TLMatDialog } from 'app/shared/components/dialog-wrapper/tl-mat-dialog';
import { BaseDataTableManager } from 'app/shared/utils/base-data-table.manager';
import { CommonUtils } from 'app/shared/utils/common.utils';
import { EditRoomComponent } from './components/edit-room/edit-room.component';
import { HeaderCloseFunction } from 'app/shared/components/dialog-wrapper/interfaces/header-cancel-button.interface';
import { HotelRoomsService } from 'app/services/administration/hotel-rooms.service';

@Component({
    selector: 'app-rooms',
    templateUrl: './rooms.component.html',
    styleUrl: './rooms.component.scss'
})
export class RoomsComponent implements OnInit, AfterViewInit {
    public readonly recordsPerPage: number = CommonUtils.RECORDS_PER_PAGE;

    @ViewChild(TLDataTableComponent)
    private datatable!: IRemoteTLDatatableComponent;

    private gridManager!: BaseDataTableManager<HotelRoomDTO>;

    private readonly service: HotelRoomsService;
    private readonly dialog: TLMatDialog<EditRoomComponent>;
    private readonly translateService: TranslateService;
    private readonly confirmationDialog: TLConfirmDialog;

    public constructor(service: HotelRoomsService,
        dialog: TLMatDialog<EditRoomComponent>,
        translateService: TranslateService,
        confirmationDialog: TLConfirmDialog) {
        this.service = service;
        this.dialog = dialog;
        this.translateService = translateService;
        this.confirmationDialog = confirmationDialog;
    }

    public ngOnInit(): void {
    }

    public viewRoom(id: number): void {
        const title = this.translateService.getValue('rooms.view-room-title');
        this.openRoomDialog(title, new DialogParamsModel(id, true));
    }

    public addRoom(): void {
        const title = this.translateService.getValue('rooms.add-room-title');
        this.openRoomDialog(title, new DialogParamsModel(undefined, false));
    }

    public editRoom(id: number): void {
        const title = this.translateService.getValue('rooms.edit-room-title');
        this.openRoomDialog(title, new DialogParamsModel(id, false));
    }

    public deleteRoom(id: number): void {
        this.confirmationDialog.open({
            title: this.translateService.getValue('rooms.delete-room-title'),
            message: this.translateService.getValue('rooms.delete-room-confirmation'),
            okBtnLabel: this.translateService.getValue('common.delete'),
        }).subscribe((result: boolean) => {
            if (result) {
                this.service.delete(id).subscribe({
                    next: () => {
                        this.gridManager.refreshData();
                    }
                });
            }
        });
    }

    public ngAfterViewInit(): void {
        this.gridManager = new BaseDataTableManager({
            requestServiceMethod: this.service.getAll.bind(this.service),
            tlDataTable: this.datatable
        });

        this.gridManager.refreshData();
    }

    private openRoomDialog(title: string, data: DialogParamsModel): void {
        this.dialog.openWithTwoButtons({
            TCtor: EditRoomComponent,
            title: title,
            translteService: this.translateService,
            headerCancelButton: {
                cancelBtnClicked: (closeFn: HeaderCloseFunction): void => { closeFn(); }
            },
            componentData: data,
            viewMode: data.isReadonly
        }, '1300px').subscribe((result: HotelRoomDTO | undefined) => {
            if (result) {
                this.gridManager.refreshData();
            }
        });
    }
}

