import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EditReservationDTO } from '../../../../../models/administration/reservation.model';
import { NomenclatureDTO } from 'app/models/common/generic-nomenclature.model';
import { ReservationsService } from '../../../../../services/administration/reservations.service';
import { IActionInfo } from 'app/shared/components/dialog-wrapper/interfaces/action-info.interface';
import { DialogCloseCallback, IDialogComponent } from 'app/shared/components/dialog-wrapper/interfaces/dialog-content.interface';
import { DialogWrapperData } from 'app/shared/components/dialog-wrapper/models/dialog-action-buttons.model';
import { DialogParamsModel } from 'app/shared/components/dialog-wrapper/models/dialog-params.model';
import { CommonUtils } from 'app/shared/utils/common.utils';
import { TLValidators } from 'app/shared/utils/tl-validators.util';
import { lastValueFrom, startWith, map } from 'rxjs';

@Component({
    selector: 'app-edit-reservation',
    templateUrl: './edit-reservation.component.html',
    styleUrl: './edit-reservation.component.scss'
})
export class EditReservationComponent implements IDialogComponent, OnInit {
    public viewMode: boolean = true;
    public id?: number;
    public form!: FormGroup;

    public clients: NomenclatureDTO<number>[] = [];
    public hotels: NomenclatureDTO<number>[] = [];
    public operators: NomenclatureDTO<number>[] = [];
    public statuses: NomenclatureDTO<number>[] = [];

    public filteredClients: NomenclatureDTO<number>[] = [];
    public filteredHotels: NomenclatureDTO<number>[] = [];
    public filteredOperators: NomenclatureDTO<number>[] = [];
    public filteredStatuses: NomenclatureDTO<number>[] = [];

    private readonly service: ReservationsService;
    private model: EditReservationDTO;

    public constructor(service: ReservationsService) {
        this.service = service;
        this.model = new EditReservationDTO();
        this.buildForm();
    }

    public async ngOnInit(): Promise<void> {
        this.clients = await lastValueFrom(this.service.getAllClients());
        this.hotels = await lastValueFrom(this.service.getAllHotels());
        this.operators = await lastValueFrom(this.service.getAllOperators());
        this.statuses = await lastValueFrom(this.service.getAllReservationStatuses());
        
        this.filteredClients = this.clients.slice();
        this.filteredHotels = this.hotels.slice();
        this.filteredOperators = this.operators.slice();
        this.filteredStatuses = this.statuses.slice();
        
        this.setAutoCompleteValidators();
        this.setupFiltering();
        
        if (this.id) {
            this.service.get(this.id).subscribe({
                next: (result: EditReservationDTO) => {
                    this.model = result;
                    this.fillForm();

                    if (this.viewMode) {
                        this.form.disable();
                    }
                }
            });
        }
    }

    private setupFiltering(): void {
        this.form.get('clientControl')?.valueChanges
            .pipe(
                startWith(''),
                map(value => {
                    if (typeof value === 'string') {
                        return this.filterNomenclature(this.clients, value);
                    } else if (value && value.displayName) {
                        return this.filterNomenclature(this.clients, value.displayName);
                    } else {
                        return this.clients.slice();
                    }
                })
            )
            .subscribe(filtered => {
                this.filteredClients = filtered;
            });

        this.form.get('hotelControl')?.valueChanges
            .pipe(
                startWith(''),
                map(value => {
                    if (typeof value === 'string') {
                        return this.filterNomenclature(this.hotels, value);
                    } else if (value && value.displayName) {
                        return this.filterNomenclature(this.hotels, value.displayName);
                    } else {
                        return this.hotels.slice();
                    }
                })
            )
            .subscribe(filtered => {
                this.filteredHotels = filtered;
            });

        this.form.get('operatorControl')?.valueChanges
            .pipe(
                startWith(''),
                map(value => {
                    if (typeof value === 'string') {
                        return this.filterNomenclature(this.operators, value);
                    } else if (value && value.displayName) {
                        return this.filterNomenclature(this.operators, value.displayName);
                    } else {
                        return this.operators.slice();
                    }
                })
            )
            .subscribe(filtered => {
                this.filteredOperators = filtered;
            });

        this.form.get('statusControl')?.valueChanges
            .pipe(
                startWith(''),
                map(value => {
                    if (typeof value === 'string') {
                        return this.filterNomenclature(this.statuses, value);
                    } else if (value && value.displayName) {
                        return this.filterNomenclature(this.statuses, value.displayName);
                    } else {
                        return this.statuses.slice();
                    }
                })
            )
            .subscribe(filtered => {
                this.filteredStatuses = filtered;
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
            clientControl: new FormControl(),
            hotelControl: new FormControl(),
            operatorControl: new FormControl(),
            statusControl: new FormControl(),
            dateFromControl: new FormControl(undefined, Validators.required),
            dateToControl: new FormControl(undefined, Validators.required),
            totalPriceControl: new FormControl(undefined, [Validators.required, TLValidators.number(0)]),
            customerNotesControl: new FormControl(undefined, Validators.maxLength(2000)),
        });
    }

    private setAutoCompleteValidators(): void {
        this.form.get('clientControl').setValidators([Validators.required, TLValidators.selectedValueFromDropdownValidator(this.clients)]);
        this.form.get('hotelControl').setValidators([Validators.required, TLValidators.selectedValueFromDropdownValidator(this.hotels)]);
        this.form.get('operatorControl').setValidators([Validators.required, TLValidators.selectedValueFromDropdownValidator(this.operators)]);
        this.form.get('statusControl').setValidators([Validators.required, TLValidators.selectedValueFromDropdownValidator(this.statuses)]);
    }

    private fillForm(): void {
        if (this.model.clientId) {
            this.form.get('clientControl')?.setValue(this.clients.find(x => x.value === this.model.clientId));
        }

        if (this.model.hotelId) {
            this.form.get('hotelControl')?.setValue(this.hotels.find(x => x.value === this.model.hotelId));
        }

        if (this.model.operatorId) {
            this.form.get('operatorControl')?.setValue(this.operators.find(x => x.value === this.model.operatorId));
        }

        if (this.model.reservationStatusId) {
            this.form.get('statusControl')?.setValue(this.statuses.find(x => x.value === this.model.reservationStatusId));
        }

        this.form.get('dateFromControl')?.setValue(this.model.dateFrom ? new Date(this.model.dateFrom) : null);
        this.form.get('dateToControl')?.setValue(this.model.dateTo ? new Date(this.model.dateTo) : null);
        this.form.get('totalPriceControl')?.setValue(this.model.totalPrice);
        this.form.get('customerNotesControl')?.setValue(this.model.customerNotes);
    }

    private fillModel(): EditReservationDTO {
        this.model.clientId = this.form.get('clientControl')?.value?.value;
        this.model.hotelId = this.form.get('hotelControl')?.value?.value;
        this.model.operatorId = this.form.get('operatorControl')?.value?.value;
        this.model.reservationStatusId = this.form.get('statusControl')?.value?.value;
        this.model.dateFrom = this.form.get('dateFromControl')?.value?.toISOString();
        this.model.dateTo = this.form.get('dateToControl')?.value?.toISOString();
        this.model.totalPrice = this.form.get('totalPriceControl')?.value;
        this.model.customerNotes = this.form.get('customerNotesControl')?.value;

        return this.model;
    }
}