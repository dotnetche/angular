import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotelRoomDTO } from 'app/models/administration/hotel-room.model';
import { NomenclatureDTO } from 'app/models/common/generic-nomenclature.model';
import { HotelRoomsService } from 'app/services/administration/hotel-rooms.service';
import { IActionInfo } from 'app/shared/components/dialog-wrapper/interfaces/action-info.interface';
import { DialogCloseCallback, IDialogComponent } from 'app/shared/components/dialog-wrapper/interfaces/dialog-content.interface';
import { DialogWrapperData } from 'app/shared/components/dialog-wrapper/models/dialog-action-buttons.model';
import { DialogParamsModel } from 'app/shared/components/dialog-wrapper/models/dialog-params.model';
import { CommonUtils } from 'app/shared/utils/common.utils';
import { TLValidators } from 'app/shared/utils/tl-validators.util';
import { lastValueFrom, map, startWith } from 'rxjs';

@Component({
    selector: 'app-edit-room',
    templateUrl: './edit-room.component.html',
    styleUrl: './edit-room.component.scss'
})
export class EditRoomComponent implements IDialogComponent, OnInit {
    public viewMode: boolean = true;
    public id?: number;
    public form!: FormGroup;

    public hotels: NomenclatureDTO<number>[] = [];
    public filteredHotels: NomenclatureDTO<number>[] = [];

    private readonly service: HotelRoomsService;
    private model: HotelRoomDTO;

    public constructor(service: HotelRoomsService) {
        this.service = service;
        this.model = new HotelRoomDTO();
        this.buildForm();
    }

    public async ngOnInit(): Promise<void> {
        this.hotels = await lastValueFrom(this.service.getHotels());
        this.filteredHotels = this.hotels.slice();
        this.setAutoCompleteValidators();
        this.setupFiltering();
        if (this.id) {
            this.service.get(this.id).subscribe({
                next: (result: HotelRoomDTO) => {
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
            nameControl: new FormControl(undefined, [Validators.required, Validators.maxLength(200)]),
            hotelControl: new FormControl(),
            priceControl: new FormControl(undefined, [Validators.required, TLValidators.number(0)]),
            descriptionControl: new FormControl(undefined, Validators.maxLength(2000)),
            maxAdultsControl: new FormControl(undefined, TLValidators.number(1)),
            maxChildrenControl: new FormControl(undefined, TLValidators.number(1)),
            maxBabiesControl: new FormControl(undefined, TLValidators.number(1)),
        });
    }

    private setAutoCompleteValidators(): void {
        this.form.get('hotelControl').setValidators([Validators.required, TLValidators.selectedValueFromDropdownValidator(this.hotels)]);
    }

    private fillForm(): void {
        this.form.get('nameControl')?.setValue(this.model.name);

        if (this.model.hotelId) {
            this.form.get('hotelControl')?.setValue(this.hotels.find(x => x.value === this.model.hotelId));
        }

        this.form.get('priceControl')?.setValue(this.model.price);
        this.form.get('descriptionControl')?.setValue(this.model.description);
        this.form.get('maxAdultsControl')?.setValue(this.model.maxAdults);
        this.form.get('maxChildrenControl')?.setValue(this.model.maxChildren);
        this.form.get('maxBabiesControl')?.setValue(this.model.maxBabies);
    }

    private fillModel(): HotelRoomDTO {
        this.model.name = this.form.get('nameControl')?.value;
        this.model.hotelId = this.form.get('hotelControl')?.value?.value;
        this.model.price = this.form.get('priceControl')?.value;
        this.model.description = this.form.get('descriptionControl')?.value;
        this.model.maxAdults = this.form.get('maxAdultsControl')?.value;
        this.model.maxChildren = this.form.get('maxChildrenControl')?.value;
        this.model.maxBabies = this.form.get('maxBabiesControl')?.value;
        return this.model;
    }
}
