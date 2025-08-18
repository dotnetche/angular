import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReservationPaymentDTO } from 'app/models/administration/reservation.model';
import { NomenclatureDTO } from 'app/models/common/generic-nomenclature.model';
import { ReservationsService } from 'app/services/administration/reservations.service';
import { IActionInfo } from 'app/shared/components/dialog-wrapper/interfaces/action-info.interface';
import { DialogCloseCallback, IDialogComponent } from 'app/shared/components/dialog-wrapper/interfaces/dialog-content.interface';
import { DialogWrapperData } from 'app/shared/components/dialog-wrapper/models/dialog-action-buttons.model';
import { CommonUtils } from 'app/shared/utils/common.utils';
import { TLValidators } from 'app/shared/utils/tl-validators.util';
import { lastValueFrom, startWith, map } from 'rxjs';
// import { TLTranslatePipe } from "../../../../../shared/pipes/tl-translate.pipe";

@Component({
    selector: 'app-edit-payment-dialog',
    templateUrl: './edit-payment-dialog.component.html',
    styleUrl: './edit-payment-dialog.component.scss',
})
export class EditPaymentDialogComponent implements IDialogComponent, OnInit {
    public viewMode: boolean = true;
    public index?: number;
    public form!: FormGroup;

    public paymentTypes: NomenclatureDTO<number>[] = [];
    public paymentChannels: NomenclatureDTO<number>[] = [];

    public filteredPaymentTypes: NomenclatureDTO<number>[] = [];
    public filteredPaymentChannels: NomenclatureDTO<number>[] = [];

    private readonly service: ReservationsService;
    private model: ReservationPaymentDTO;

    public constructor(service: ReservationsService) {
        this.service = service;
        this.model = {} as ReservationPaymentDTO;
        this.buildForm();
    }

    public async ngOnInit(): Promise<void> {
        this.paymentTypes = await lastValueFrom(this.service.getAllPaymentTypes());
        this.paymentChannels = await lastValueFrom(this.service.getAllPaymentChannels());
        
        this.filteredPaymentTypes = this.paymentTypes.slice();
        this.filteredPaymentChannels = this.paymentChannels.slice();
        
        this.setAutoCompleteValidators();
        this.setupFiltering();
        
        if (this.model) {
            this.fillForm();
            
            if (this.viewMode) {
                this.form.disable();
            }
        }
    }

    private setupFiltering(): void {
        this.form.get('paymentTypeControl')?.valueChanges
            .pipe(
                startWith(''),
                map(value => {
                    if (typeof value === 'string') {
                        return this.filterNomenclature(this.paymentTypes, value);
                    } else if (value && value.displayName) {
                        return this.filterNomenclature(this.paymentTypes, value.displayName);
                    } else {
                        return this.paymentTypes.slice();
                    }
                })
            )
            .subscribe(filtered => {
                this.filteredPaymentTypes = filtered;
            });

        this.form.get('paymentChannelControl')?.valueChanges
            .pipe(
                startWith(''),
                map(value => {
                    if (typeof value === 'string') {
                        return this.filterNomenclature(this.paymentChannels, value);
                    } else if (value && value.displayName) {
                        return this.filterNomenclature(this.paymentChannels, value.displayName);
                    } else {
                        return this.paymentChannels.slice();
                    }
                })
            )
            .subscribe(filtered => {
                this.filteredPaymentChannels = filtered;
            });
    }

    private filterNomenclature<T>(options: NomenclatureDTO<T>[], filterValue: string): NomenclatureDTO<T>[] {
        if (!filterValue) {
            return options.slice();
        }

        const filterValueLower = filterValue.toLowerCase();
        return options.filter(option => {
            const displayNameMatch = option.displayName &&
                option.displayName.toLowerCase().includes(filterValueLower);
            
            const codeMatch = option.code &&
                option.code.toLowerCase().includes(filterValueLower);
            
            const descriptionMatch = option.description &&
                option.description.toLowerCase().includes(filterValueLower);

            return displayNameMatch || codeMatch || descriptionMatch;
        });
    }

    public setData(data: any, wrapperData: DialogWrapperData): void {
        this.viewMode = data.isReadonly;
        this.index = data.id;
        if (data.payment) {
            this.model = data.payment;
        }
    }

    public dialogButtonClicked(actionInfo: IActionInfo, dialogClose: DialogCloseCallback): void {
        dialogClose();
    }

    public saveBtnClicked(actionInfo: IActionInfo, dialogClose: DialogCloseCallback): void {
        this.form.markAllAsTouched();

        if (this.form.valid) {
            this.model = this.fillModel();
            dialogClose(this.model);
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
            dueDateControl: new FormControl(undefined, Validators.required),
            paymentTypeControl: new FormControl(),
            paymentChannelControl: new FormControl(),
            amountControl: new FormControl(undefined, [Validators.required, TLValidators.number(0)]),
            isPaidControl: new FormControl(false),
        });
    }

    private setAutoCompleteValidators(): void {
        this.form.get('paymentTypeControl')?.setValidators([Validators.required, TLValidators.selectedValueFromDropdownValidator(this.paymentTypes)]);
        this.form.get('paymentChannelControl')?.setValidators([Validators.required, TLValidators.selectedValueFromDropdownValidator(this.paymentChannels)]);
    }

    private fillForm(): void {
        this.form.get('dueDateControl')?.setValue(this.model.dueDate ? new Date(this.model.dueDate) : null);
        this.form.get('amountControl')?.setValue(this.model.amount);
        this.form.get('isPaidControl')?.setValue(this.model.isPaid);

        if (this.model.paymentTypeId) {
            this.form.get('paymentTypeControl')?.setValue(this.paymentTypes.find(x => x.value === this.model.paymentTypeId));
        }

        if (this.model.paymentChannelId) {
            this.form.get('paymentChannelControl')?.setValue(this.paymentChannels.find(x => x.value === this.model.paymentChannelId));
        }
    }

    private fillModel(): ReservationPaymentDTO {
        this.model.dueDate = this.form.get('dueDateControl')?.value?.toISOString();
        this.model.paymentTypeId = this.form.get('paymentTypeControl')?.value?.value;
        this.model.paymentTypeName = this.form.get('paymentTypeControl')?.value?.displayName;
        this.model.paymentChannelId = this.form.get('paymentChannelControl')?.value?.value;
        this.model.paymentChannelName = this.form.get('paymentChannelControl')?.value?.displayName;
        this.model.amount = this.form.get('amountControl')?.value;
        this.model.isPaid = this.form.get('isPaidControl')?.value;

        return this.model;
    }
}