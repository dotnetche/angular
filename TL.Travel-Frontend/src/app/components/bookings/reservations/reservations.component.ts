import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from 'app/core/translation/translate.service';
import { ReservationDTO } from '../../../models/administration/reservation.model';
import { ReservationsService } from '../../../services/administration/reservations.service';
import { TLConfirmDialog } from 'app/shared/components/confirmation-dialog/utils/tl-confirm-dialog.util';
import { IRemoteTLDatatableComponent } from 'app/shared/components/data-table/interfaces/tl-remote-datatable.interface';
import { TLDataTableComponent } from 'app/shared/components/data-table/tl-data-table.component';
import { DialogParamsModel } from 'app/shared/components/dialog-wrapper/models/dialog-params.model';
import { TLMatDialog } from 'app/shared/components/dialog-wrapper/tl-mat-dialog';
import { BaseDataTableManager } from 'app/shared/utils/base-data-table.manager';
import { CommonUtils } from 'app/shared/utils/common.utils';
import { HeaderCloseFunction } from 'app/shared/components/dialog-wrapper/interfaces/header-cancel-button.interface';
import { EditReservationComponent } from './components/edit-reservation/edit-reservation.component';

@Component({
    selector: 'app-reservations',
    templateUrl: './reservations.component.html',
    styleUrl: './reservations.component.scss'
})
export class ReservationsComponent implements OnInit, AfterViewInit {
    public readonly recordsPerPage: number = CommonUtils.RECORDS_PER_PAGE;

    @ViewChild(TLDataTableComponent)
    private datatable!: IRemoteTLDatatableComponent;

    private gridManager!: BaseDataTableManager<ReservationDTO>;

    private readonly service: ReservationsService;
    private readonly dialog: TLMatDialog<EditReservationComponent>;
    private readonly translateService: TranslateService;
    private readonly confirmationDialog: TLConfirmDialog;

    public constructor(service: ReservationsService,
        dialog: TLMatDialog<EditReservationComponent>,
        translateService: TranslateService,
        confirmationDialog: TLConfirmDialog) {
        this.service = service;
        this.dialog = dialog;
        this.translateService = translateService;
        this.confirmationDialog = confirmationDialog;
    }

    public ngOnInit(): void {
    }

    public viewReservation(id: number): void {
        const title = this.translateService.getValue('reservations.view-reservation-title');
        this.openReservationDialog(title, new DialogParamsModel(id, true));
    }

    public addReservation(): void {
        const title = this.translateService.getValue('reservations.add-reservation-title');
        this.openReservationDialog(title, new DialogParamsModel(undefined, false));
    }

    public editReservation(id: number): void {
        const title = this.translateService.getValue('reservations.edit-reservation-title');
        this.openReservationDialog(title, new DialogParamsModel(id, false));
    }

    public deleteReservation(id: number): void {
        this.confirmationDialog.open({
            title: this.translateService.getValue('reservations.delete-reservation-title'),
            message: this.translateService.getValue('reservations.delete-reservation-confirmation'),
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

    private openReservationDialog(title: string, data: DialogParamsModel): void {
        this.dialog.openWithTwoButtons({
            TCtor: EditReservationComponent,
            title: title,
            translteService: this.translateService,
            headerCancelButton: {
                cancelBtnClicked: (closeFn: HeaderCloseFunction): void => { closeFn(); }
            },
            componentData: data,
            viewMode: data.isReadonly
        }, '1600px').subscribe((result: ReservationDTO | undefined) => {
            if (result) {
                this.gridManager.refreshData();
            }
        });
    }
}