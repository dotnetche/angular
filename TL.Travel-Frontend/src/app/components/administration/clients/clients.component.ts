import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from 'app/core/translation/translate.service';
import { ClientDTO } from 'app/models/administration/client.model';
import { ClientsService } from 'app/services/administration/clients.service';
import { TLConfirmDialog } from 'app/shared/components/confirmation-dialog/utils/tl-confirm-dialog.util';
import { IRemoteTLDatatableComponent } from 'app/shared/components/data-table/interfaces/tl-remote-datatable.interface';
import { TLDataTableComponent } from 'app/shared/components/data-table/tl-data-table.component';
import { DialogParamsModel } from 'app/shared/components/dialog-wrapper/models/dialog-params.model';
import { TLMatDialog } from 'app/shared/components/dialog-wrapper/tl-mat-dialog';
import { BaseDataTableManager } from 'app/shared/utils/base-data-table.manager';
import { CommonUtils } from 'app/shared/utils/common.utils';
import { EditClientComponent } from './components/edit-client/edit-client.component';
import { HeaderCloseFunction } from 'app/shared/components/dialog-wrapper/interfaces/header-cancel-button.interface';

@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html',
    styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit, AfterViewInit {
    public readonly recordsPerPage: number = CommonUtils.RECORDS_PER_PAGE;

    @ViewChild(TLDataTableComponent)
    private datatable!: IRemoteTLDatatableComponent;

    private gridManager!: BaseDataTableManager<ClientDTO>;

    private readonly service: ClientsService;
    private readonly dialog: TLMatDialog<EditClientComponent>;
    private readonly translateService: TranslateService;
    private readonly confirmationDialog: TLConfirmDialog;

    public constructor(service: ClientsService,
        dialog: TLMatDialog<EditClientComponent>,
        translateService: TranslateService,
        confirmationDialog: TLConfirmDialog) {
        this.service = service;
        this.dialog = dialog;
        this.translateService = translateService;
        this.confirmationDialog = confirmationDialog;
    }

    public ngOnInit(): void {
    }

    public viewClient(id: number): void {
        const title = this.translateService.getValue('clients.view-client-title');
        this.openClientDialog(title, new DialogParamsModel(id, true));
    }

    public addClient(): void {
        const title = this.translateService.getValue('clients.add-client-title');
        this.openClientDialog(title, new DialogParamsModel(undefined, false));
    }

    public editClient(id: number): void {
        const title = this.translateService.getValue('clients.edit-client-title');
        this.openClientDialog(title, new DialogParamsModel(id, false));
    }

    public deleteClient(id: number): void {
        this.confirmationDialog.open({
            title: this.translateService.getValue('clients.delete-client-title'),
            message: this.translateService.getValue('clients.delete-client-confirmation'),
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

    private openClientDialog(title: string, data: DialogParamsModel): void {
        this.dialog.openWithTwoButtons({
            TCtor: EditClientComponent,
            title: title,
            translteService: this.translateService,
            headerCancelButton: {
                cancelBtnClicked: (closeFn: HeaderCloseFunction): void => { closeFn(); }
            },
            componentData: data,
            viewMode: data.isReadonly
        }, '1300px').subscribe((result: ClientDTO | undefined) => {
            if (result) {
                this.gridManager.refreshData();
            }
        });
    }
}

