
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UrlHandlingStrategy } from '@angular/router';
import { HotelDTO } from 'app/models/administration/hotel.model';
import { NomenclatureDTO } from 'app/models/common/generic-nomenclature.model';
import { HotelsService } from 'app/services/administration/hotels.service';
import { IActionInfo } from 'app/shared/components/dialog-wrapper/interfaces/action-info.interface';
import { DialogCloseCallback, IDialogComponent } from 'app/shared/components/dialog-wrapper/interfaces/dialog-content.interface';
import { DialogWrapperData } from 'app/shared/components/dialog-wrapper/models/dialog-action-buttons.model';
import { DialogParamsModel } from 'app/shared/components/dialog-wrapper/models/dialog-params.model';
import { CommonUtils } from 'app/shared/utils/common.utils';
import { TLValidators } from 'app/shared/utils/tl-validators.util';
import { lastValueFrom, startWith, map } from 'rxjs';

@Component({
    selector: 'app-edit-hotel',
    templateUrl: './edit-hotel.component.html',
    styleUrl: './edit-hotel.component.scss'
})
export class EditHotelComponent implements IDialogComponent, OnInit {
    public viewMode: boolean = true;
    public hoverStar: number = 0;

    setHoverStar(star: number): void {
        this.hoverStar = star;
    }

    selectStar(star: number): void {
        this.form.get('starsControl')?.setValue(star);
    }
    public id?: number;
    public form!: FormGroup;

    public agents: NomenclatureDTO<number>[] = [];
    public locations: NomenclatureDTO<number>[] = [];
    public oprators: NomenclatureDTO<number>[] = [];

    public filteredAgent: NomenclatureDTO<number>[] = [];
    public filteredLocations: NomenclatureDTO<number>[] = [];
    public filteredOperators: NomenclatureDTO<number>[] = [];

    private readonly service: HotelsService;
    private model: HotelDTO;

    public constructor(service: HotelsService) {
        this.service = service;
        this.model = new HotelDTO();
        this.buildForm();
    }

    public async ngOnInit(): Promise<void> {
        this.agents = await lastValueFrom(this.service.getAllAgents());
        this.locations = await lastValueFrom(this.service.getAllLocations());
        this.agents = await lastValueFrom(this.service.getAllAgents());
        this.filteredAgent  = this.agents.slice();
        this.filteredLocations = this.locations.slice();
        this.filteredOperators = this.oprators.slice();
        this.setAutoCompleteValidators();
        this.setupFiltering();
        if (this.id) {
            this.service.get(this.id).subscribe({
                next: (result: HotelDTO) => {
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
       
        this.form.get('locationControl')?.valueChanges
            .pipe(
                startWith(''),
                map(value => {
                    if (typeof value === 'string') {
                        return this.filterNomenclature(this.locations, value);
                    } else if (value && value.displayName) {
                        return this.filterNomenclature(this.locations, value.displayName);
                    } else {
                        return this.locations.slice();
                    }
                })
            )
            .subscribe(filtered => {
                this.filteredLocations = filtered;
            });
 
       
        this.form.get('agentControl')?.valueChanges
            .pipe(
                startWith(''),
                map(value => {
                    if (typeof value === 'string') {
                        return this.filterNomenclature(this.agents, value);
                    } else if (value && value.displayName) {
                        return this.filterNomenclature(this.agents, value.displayName);
                    } else {
                        return this.agents.slice();
                    }
                })
            )
            .subscribe(filtered => {
                this.filteredAgent = filtered;
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
            starsControl: new FormControl(undefined, Validators.required),
            contactsControl: new FormControl(undefined, Validators.required),
            locationControl: new FormControl(),
            agentControl: new FormControl(),
            isTemporaryClosedControl : new FormControl(false)
        });
    }

    private setAutoCompleteValidators(): void {
        this.form.get('locationControl').setValidators([Validators.required, TLValidators.selectedValueFromDropdownValidator(this.locations)]);
        this.form.get('agentControl').setValidators([Validators.required, TLValidators.selectedValueFromDropdownValidator(this.agents)]);
    }

    private fillForm(): void {
        this.form.get('nameControl')?.setValue(this.model.name);

        
        if (this.model.partnerId) {
            this.form.get('agentControl')?.setValue(this.agents.find(x => x.value === this.model.partnerId));
        }

        if (this.model.locationId) {
            this.form.get('locationControl')?.setValue(this.locations.find(x => x.value === this.model.locationId));
        }

        this.form.get('starsControl')?.setValue(this.model.stars);
        this.form.get('contactsControl')?.setValue(this.model.contacts);
        this.form.get('isTemporaryClosedControl')?.setValue(this.model.isTemporaryClosed);
    }

    private fillModel(): HotelDTO {
        this.model.name = this.form.get('nameControl')?.value;
        this.model.stars = this.form.get('starsControl')?.value;
        this.model.contacts = this.form.get('contactsControl')?.value;
        this.model.locationId = this.form.get('locationControl')?.value?.value;
        this.model.partnerId = this.form.get('agentControl')?.value?.value;
        this.model.isTemporaryClosed = this.form.get('isTemporaryClosedControl')?.value;

        return this.model;
    }
}
