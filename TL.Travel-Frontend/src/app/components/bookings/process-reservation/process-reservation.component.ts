import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { EditReservationDTO, ReservationRoomDTO, ReservationPaymentDTO } from 'app/models/administration/reservation.model';
import { NomenclatureDTO } from 'app/models/common/generic-nomenclature.model';
import { ReservationsService } from 'app/services/administration/reservations.service';
import { TLConfirmDialog } from 'app/shared/components/confirmation-dialog/utils/tl-confirm-dialog.util';
import { DialogParamsModel } from 'app/shared/components/dialog-wrapper/models/dialog-params.model';
import { TLMatDialog } from 'app/shared/components/dialog-wrapper/tl-mat-dialog';
import { CommonUtils } from 'app/shared/utils/common.utils';
import { TLValidators } from 'app/shared/utils/tl-validators.util';
import { lastValueFrom, startWith, map } from 'rxjs';
import { EditRoomDialogComponent } from './components/edit-room-dialog/edit-room-dialog.component';
import { EditPaymentDialogComponent } from './components/edit-payment-dialog/edit-payment-dialog.component';
import { TranslateService } from 'app/core/translation/translate.service';
import { HeaderCloseFunction } from 'app/shared/components/dialog-wrapper/interfaces/header-cancel-button.interface';

@Component({
    selector: 'app-process-reservation',
    templateUrl: './process-reservation.component.html',
    styleUrl: './process-reservation.component.scss'
})
export class ProcessReservationComponent implements OnInit {
    public form!: FormGroup;
    public model: EditReservationDTO;
    public id?: number;

    public clients: NomenclatureDTO<number>[] = [];
    public hotels: NomenclatureDTO<number>[] = [];
    public operators: NomenclatureDTO<number>[] = [];
    public statuses: NomenclatureDTO<number>[] = [];

    public filteredClients: NomenclatureDTO<number>[] = [];
    public filteredHotels: NomenclatureDTO<number>[] = [];
    public filteredOperators: NomenclatureDTO<number>[] = [];
    public filteredStatuses: NomenclatureDTO<number>[] = [];

    public roomsDataSource = new MatTableDataSource<ReservationRoomDTO>();
    public paymentsDataSource = new MatTableDataSource<ReservationPaymentDTO>();

    public roomDisplayedColumns: string[] = ['adults', 'children', 'babies', 'hotelRoomName', 'feedingTypeName', 'price', 'actions'];
    public paymentDisplayedColumns: string[] = ['dueDate', 'paymentTypeName', 'paymentChannelName', 'amount', 'isPaid', 'actions'];

    private readonly service: ReservationsService;
    private readonly router: Router;
    private readonly route: ActivatedRoute;
    private readonly dialog: TLMatDialog<EditRoomDialogComponent>;
    private readonly paymentDialog: TLMatDialog<EditPaymentDialogComponent>;
    private readonly confirmationDialog: TLConfirmDialog;
    private readonly translateService: TranslateService;

    public constructor(
        service: ReservationsService,
        router: Router,
        route: ActivatedRoute,
        dialog: TLMatDialog<EditRoomDialogComponent>,
        paymentDialog: TLMatDialog<EditPaymentDialogComponent>,
        confirmationDialog: TLConfirmDialog,
        translateService: TranslateService
    ) {
        this.service = service;
        this.router = router;
        this.route = route;
        this.dialog = dialog;
        this.paymentDialog = paymentDialog;
        this.confirmationDialog = confirmationDialog;
        this.translateService = translateService;
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

        // Check if we have an ID in the route
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.id = +params['id'];
                this.loadReservation();
            } else {
                this.initializeNewReservation();
            }
        });
    }

    private async loadReservation(): Promise<void> {
        if (this.id) {
            this.service.get(this.id).subscribe({
                next: (result: EditReservationDTO) => {
                    this.model = result;
                    this.fillForm();
                    this.updateDataSources();
                }
            });
        }
    }

    private initializeNewReservation(): void {
        this.model.reservationRooms = [];
        this.model.reservationPayments = [];
        this.updateDataSources();
    }

    private updateDataSources(): void {
        this.roomsDataSource.data = this.model.reservationRooms || [];
        this.paymentsDataSource.data = this.model.reservationPayments || [];
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

    public addRoom(): void {
        const title = this.translateService.getValue('reservations.add-room-title');
        this.openRoomDialog(title, new DialogParamsModel(undefined, false));
    }

    public editRoom(index: number): void {
        const title = this.translateService.getValue('reservations.edit-room-title');
        this.openRoomDialog(title, new DialogParamsModel(index, false));
    }

    public deleteRoom(index: number): void {
        this.confirmationDialog.open({
            title: this.translateService.getValue('reservations.delete-room-title'),
            message: this.translateService.getValue('reservations.delete-room-confirmation'),
            okBtnLabel: this.translateService.getValue('common.delete'),
        }).subscribe((result: boolean) => {
            if (result) {
                this.model.reservationRooms?.splice(index, 1);
                this.updateDataSources();
            }
        });
    }

    public addPayment(): void {
        const title = this.translateService.getValue('reservations.add-payment-title');
        this.openPaymentDialog(title, new DialogParamsModel(undefined, false));
    }

    public editPayment(index: number): void {
        const title = this.translateService.getValue('reservations.edit-payment-title');
        this.openPaymentDialog(title, new DialogParamsModel(index, false));
    }

    public deletePayment(index: number): void {
        this.confirmationDialog.open({
            title: this.translateService.getValue('reservations.delete-payment-title'),
            message: this.translateService.getValue('reservations.delete-payment-confirmation'),
            okBtnLabel: this.translateService.getValue('common.delete'),
        }).subscribe((result: boolean) => {
            if (result) {
                this.model.reservationPayments?.splice(index, 1);
                this.updateDataSources();
            }
        });
    }

    public save(): void {
        this.form.markAllAsTouched();

        if (this.form.valid) {
            this.model = this.fillModel();

            if (this.id) {
                this.service.update(this.model).subscribe({
                    next: () => {
                        this.router.navigate(['/booking/reservations']);
                    }
                });
            } else {
                this.service.add(this.model).subscribe({
                    next: () => {
                        this.router.navigate(['/booking/reservations']);
                    }
                });
            }
        }
    }

    public cancel(): void {
        this.router.navigate(['/booking/reservations']);
    }

    public autocompleteDisplayFunction<T>(object: NomenclatureDTO<T> | string | null | undefined): string {
        return CommonUtils.nomenclatureDisplayFunction(object);
    }

    private openRoomDialog(title: string, data: DialogParamsModel): void {
        const roomData = data.id !== undefined ? this.model.reservationRooms![data.id] : undefined;
        
        this.dialog.openWithTwoButtons({
            TCtor: EditRoomDialogComponent,
            title: title,
            translteService: this.translateService,
            headerCancelButton: {
                cancelBtnClicked: (closeFn: HeaderCloseFunction): void => { closeFn(); }
            },
            componentData: { ...data, room: roomData, hotelId: this.form.get('hotelControl')?.value?.value },
            viewMode: data.isReadonly
        }, '800px').subscribe((result: ReservationRoomDTO | undefined) => {
            if (result) {
                if (data.id !== undefined) {
                    this.model.reservationRooms![data.id] = result;
                } else {
                    if (!this.model.reservationRooms) {
                        this.model.reservationRooms = [];
                    }
                    this.model.reservationRooms.push(result);
                }
                this.updateDataSources();
            }
        });
    }

    private openPaymentDialog(title: string, data: DialogParamsModel): void {
        const paymentData = data.id !== undefined ? this.model.reservationPayments![data.id] : undefined;
        
        this.paymentDialog.openWithTwoButtons({
            TCtor: EditPaymentDialogComponent,
            title: title,
            translteService: this.translateService,
            headerCancelButton: {
                cancelBtnClicked: (closeFn: HeaderCloseFunction): void => { closeFn(); }
            },
            componentData: { ...data, payment: paymentData },
            viewMode: data.isReadonly
        }, '800px').subscribe((result: ReservationPaymentDTO | undefined) => {
            if (result) {
                if (data.id !== undefined) {
                    this.model.reservationPayments![data.id] = result;
                } else {
                    if (!this.model.reservationPayments) {
                        this.model.reservationPayments = [];
                    }
                    this.model.reservationPayments.push(result);
                }
                this.updateDataSources();
            }
        });
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
        this.form.get('clientControl')?.setValidators([Validators.required, TLValidators.selectedValueFromDropdownValidator(this.clients)]);
        this.form.get('hotelControl')?.setValidators([Validators.required, TLValidators.selectedValueFromDropdownValidator(this.hotels)]);
        this.form.get('operatorControl')?.setValidators([Validators.required, TLValidators.selectedValueFromDropdownValidator(this.operators)]);
        this.form.get('statusControl')?.setValidators([Validators.required, TLValidators.selectedValueFromDropdownValidator(this.statuses)]);
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