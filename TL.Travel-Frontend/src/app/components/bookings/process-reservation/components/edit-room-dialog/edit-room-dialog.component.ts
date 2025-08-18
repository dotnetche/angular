import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReservationRoomDTO } from 'app/models/administration/reservation.model';
import { NomenclatureDTO } from 'app/models/common/generic-nomenclature.model';
import { ReservationsService } from 'app/services/administration/reservations.service';
import { IActionInfo } from 'app/shared/components/dialog-wrapper/interfaces/action-info.interface';
import { DialogCloseCallback, IDialogComponent } from 'app/shared/components/dialog-wrapper/interfaces/dialog-content.interface';
import { DialogWrapperData } from 'app/shared/components/dialog-wrapper/models/dialog-action-buttons.model';
import { CommonUtils } from 'app/shared/utils/common.utils';
import { TLValidators } from 'app/shared/utils/tl-validators.util';
import { lastValueFrom, startWith, map } from 'rxjs';

@Component({
    selector: 'app-edit-room-dialog',
    templateUrl: './edit-room-dialog.component.html',
    styleUrl: './edit-room-dialog.component.scss'
})
export class EditRoomDialogComponent implements IDialogComponent, OnInit {
    public viewMode: boolean = true;
    public index?: number;
    public hotelId?: number;
    public form!: FormGroup;

    public hotelRooms: NomenclatureDTO<number>[] = [];
    public feedingTypes: NomenclatureDTO<number>[] = [];

    public filteredHotelRooms: NomenclatureDTO<number>[] = [];
    public filteredFeedingTypes: NomenclatureDTO<number>[] = [];

    private readonly service: ReservationsService;
    private model: ReservationRoomDTO;

    public constructor(service: ReservationsService) {
        this.service = service;
        this.model = {} as ReservationRoomDTO;
        this.buildForm();
    }

    public async ngOnInit(): Promise<void> {
        this.feedingTypes = await lastValueFrom(this.service.getAllFeedingTypes());
        
        if (this.hotelId) {
            this.hotelRooms = await lastValueFrom(this.service.getAllHotelRooms(this.hotelId));
        }
        
        this.filteredHotelRooms = this.hotelRooms.slice();
        this.filteredFeedingTypes = this.feedingTypes.slice();
        
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
        this.form.get('hotelRoomControl')?.valueChanges
            .pipe(
                startWith(''),
                map(value => {
                    if (typeof value === 'string') {
                        return this.filterNomenclature(this.hotelRooms, value);
                    } else if (value && value.displayName) {
                        return this.filterNomenclature(this.hotelRooms, value.displayName);
                    } else {
                        return this.hotelRooms.slice();
                    }
                })
            )
            .subscribe(filtered => {
                this.filteredHotelRooms = filtered;
            });

        this.form.get('feedingTypeControl')?.valueChanges
            .pipe(
                startWith(''),
                map(value => {
                    if (typeof value === 'string') {
                        return this.filterNomenclature(this.feedingTypes, value);
                    } else if (value && value.displayName) {
                        return this.filterNomenclature(this.feedingTypes, value.displayName);
                    } else {
                        return this.feedingTypes.slice();
                    }
                })
            )
            .subscribe(filtered => {
                this.filteredFeedingTypes = filtered;
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
        this.hotelId = data.hotelId;
        if (data.room) {
            this.model = data.room;
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
            adultsControl: new FormControl(undefined, [Validators.required, TLValidators.number(1)]),
            childrenControl: new FormControl(undefined, TLValidators.number(0)),
            babiesControl: new FormControl(undefined, TLValidators.number(0)),
            hotelRoomControl: new FormControl(),
            feedingTypeControl: new FormControl(),
            priceControl: new FormControl(undefined, [Validators.required, TLValidators.number(0)]),
        });
    }

    private setAutoCompleteValidators(): void {
        this.form.get('hotelRoomControl')?.setValidators([Validators.required, TLValidators.selectedValueFromDropdownValidator(this.hotelRooms)]);
        this.form.get('feedingTypeControl')?.setValidators([Validators.required, TLValidators.selectedValueFromDropdownValidator(this.feedingTypes)]);
    }

    private fillForm(): void {
        this.form.get('adultsControl')?.setValue(this.model.adults);
        this.form.get('childrenControl')?.setValue(this.model.children);
        this.form.get('babiesControl')?.setValue(this.model.babies);
        this.form.get('priceControl')?.setValue(this.model.price);

        if (this.model.hotelRoomId) {
            this.form.get('hotelRoomControl')?.setValue(this.hotelRooms.find(x => x.value === this.model.hotelRoomId));
        }

        if (this.model.feedingTypeId) {
            this.form.get('feedingTypeControl')?.setValue(this.feedingTypes.find(x => x.value === this.model.feedingTypeId));
        }
    }

    private fillModel(): ReservationRoomDTO {
        this.model.adults = this.form.get('adultsControl')?.value;
        this.model.children = this.form.get('childrenControl')?.value;
        this.model.babies = this.form.get('babiesControl')?.value;
        this.model.hotelRoomId = this.form.get('hotelRoomControl')?.value?.value;
        this.model.hotelRoomName = this.form.get('hotelRoomControl')?.value?.displayName;
        this.model.feedingTypeId = this.form.get('feedingTypeControl')?.value?.value;
        this.model.feedingTypeName = this.form.get('feedingTypeControl')?.value?.displayName;
        this.model.price = this.form.get('priceControl')?.value;

        return this.model;
    }
}