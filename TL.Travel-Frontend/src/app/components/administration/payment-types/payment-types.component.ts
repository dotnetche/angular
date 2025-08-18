import { Component, ViewChild } from '@angular/core';
import { PaymentTypesService } from 'app/services/administration/payment-types.service';
import { IRemoteTLDatatableComponent } from 'app/shared/components/data-table/interfaces/tl-remote-datatable.interface';
import { BaseDataTableManager } from 'app/shared/utils/base-data-table.manager';
import { CommonUtils } from 'app/shared/utils/common.utils';
import { EditPaymentTypesComponent } from './edit-payment-types/edit-payment-types.component';
import { TranslateService } from 'app/core/translation/translate.service';
import { TLConfirmDialog } from 'app/shared/components/confirmation-dialog/utils/tl-confirm-dialog.util';
import { TLMatDialog } from 'app/shared/components/dialog-wrapper/tl-mat-dialog';
import { PaymentTypeDTO } from 'app/models/administration/payment-type.model';
import { TLDataTableComponent } from 'app/shared/components/data-table/tl-data-table.component';
import { DialogParamsModel } from 'app/shared/components/dialog-wrapper/models/dialog-params.model';
import { HeaderCloseFunction } from 'app/shared/components/dialog-wrapper/interfaces/header-cancel-button.interface';

@Component({
  selector: 'app-payment-types',
  templateUrl: './payment-types.component.html',
  styleUrl: './payment-types.component.scss'
})
export class PaymentTypesComponent {
public readonly recordsPerPage: number = CommonUtils.RECORDS_PER_PAGE;

    @ViewChild(TLDataTableComponent)
    private datatable!: IRemoteTLDatatableComponent;

    private gridManager!: BaseDataTableManager<PaymentTypeDTO>;

    private readonly service: PaymentTypesService;
    private readonly dialog: TLMatDialog<EditPaymentTypesComponent>;
    private readonly translateService: TranslateService;
    private readonly confirmationDialog: TLConfirmDialog;

    public constructor(service: PaymentTypesService,
        dialog: TLMatDialog<EditPaymentTypesComponent>,
        translateService: TranslateService,
        confirmationDialog: TLConfirmDialog) {
        this.service = service;
        this.dialog = dialog;
        this.translateService = translateService;
        this.confirmationDialog = confirmationDialog;
    }

    public ngOnInit(): void {
    }

    public viewPaymentType(id: number): void {
        const title = this.translateService.getValue('payment-types.view-payment-types-title');
        this.openPaymentTypeDialog(title, new DialogParamsModel(id, true));
    }

    public addPaymentType(): void {
        const title = this.translateService.getValue('payment-types.add-payment-types-title');
        this.openPaymentTypeDialog(title, new DialogParamsModel(undefined, false));
    }

    public editPaymentType(id: number): void {
        const title = this.translateService.getValue('payment-types.edit-payment-types-title');
        this.openPaymentTypeDialog(title, new DialogParamsModel(id, false));
    }

    public deletePaymentType(id: number): void {
        this.confirmationDialog.open({
            title: this.translateService.getValue('payment-types.delete-payment-types-title'),
            message: this.translateService.getValue('payment-types.delete-payment-types-confirmation'),
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

    private openPaymentTypeDialog(title: string, data: DialogParamsModel): void {
        this.dialog.openWithTwoButtons({
            TCtor: EditPaymentTypesComponent,
            title: title,
            translteService: this.translateService,
            headerCancelButton: {
                cancelBtnClicked: (closeFn: HeaderCloseFunction): void => { closeFn(); }
            },
            componentData: data,
            viewMode: data.isReadonly
        }, '600px').subscribe((result: PaymentTypeDTO | undefined) => {
            if (result) {
                this.gridManager.refreshData();
            }
        });
    }
}
