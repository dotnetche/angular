import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientDTO } from 'app/models/administration/client.model';
import { NomenclatureDTO } from 'app/models/common/generic-nomenclature.model';
import { ClientsService } from 'app/services/administration/clients.service';
import { IActionInfo } from 'app/shared/components/dialog-wrapper/interfaces/action-info.interface';
import { DialogCloseCallback, IDialogComponent } from 'app/shared/components/dialog-wrapper/interfaces/dialog-content.interface';
import { DialogWrapperData } from 'app/shared/components/dialog-wrapper/models/dialog-action-buttons.model';
import { DialogParamsModel } from 'app/shared/components/dialog-wrapper/models/dialog-params.model';
import { CommonUtils } from 'app/shared/utils/common.utils';

@Component({
    selector: 'app-edit-client',
    templateUrl: './edit-client.component.html',
    styleUrl: './edit-client.component.scss',
})
export class EditClientComponent implements IDialogComponent, OnInit {
    public viewMode: boolean = true;
    public id?: number;
    public form!: FormGroup;
    
    private readonly service: ClientsService;
    private model: ClientDTO;

    public constructor(service: ClientsService) {
        this.service = service;
        this.model = new ClientDTO();
        this.buildForm();
    }

    public async ngOnInit(): Promise<void> {
        if (this.id) {
            this.service.get(this.id).subscribe({
                next: (result: ClientDTO) => {
                    this.model = result;
                    this.fillForm();

                    if (this.viewMode) {
                        this.form.disable();
                    }
                }
            });
        }
    }

    public setData(data: DialogParamsModel, wrapperData: DialogWrapperData): void {
        this.viewMode = data.isReadonly;
        this.id = data.id;
    }

    public dialogButtonClicked(actionInfo: IActionInfo, dialogClose: DialogCloseCallback): void {
        dialogClose();
    }

    public saveBtnClicked(actionInfo: IActionInfo, dialogClose: DialogCloseCallback): void {
        this.form.markAllAsTouched();

        if (this.form.valid) {
            this.model = this.fillModel();

            if (this.id) {
                this.service.update(this.model).subscribe({
                    next: () => {
                        dialogClose(this.model);
                    }
                });
            }
            else {
                this.service.add(this.model).subscribe({
                    next: () => {
                        dialogClose(this.model);
                    }
                });
            }
        }

    }

    public cancelBtnClicked(actionInfo: IActionInfo, dialogClose: DialogCloseCallback): void {
        dialogClose();
    }

    public closeBtnClicked?(actionInfo: IActionInfo, dialogClose: DialogCloseCallback): void {
        dialogClose();
    }

    public autocompleteDisplayFunction<T>(object: NomenclatureDTO<T> | string | null | undefined): string {
        return CommonUtils.nomenclatureDisplayFunction(object);
    }

    private buildForm(): void {
        this.form = new FormGroup({
            nameControl: new FormControl(undefined, [Validators.required, Validators.maxLength(200)]),
            emailControl: new FormControl(undefined, [Validators.required, Validators.email]),
            phoneControl: new FormControl(undefined, [Validators.required, Validators.maxLength(10)]),
        });
    }

   

    private fillForm(): void {

        this.form.get('nameControl')?.setValue(this.model.name);
        this.form.get('emailControl')?.setValue(this.model.email);
        this.form.get('phoneControl')?.setValue(this.model.phone);
    }

    private fillModel(): ClientDTO {
        this.model.name = this.form.get('nameControl')?.value;
        this.model.email = this.form.get('emailControl')?.value;
        this.model.phone = this.form.get('phoneControl')?.value;
        return this.model;
    }
}
