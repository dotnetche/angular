import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatBadgeModule} from '@angular/material/badge';
import { ReservationsService } from '../../services/reservations.service';
import { 
  ReservationDTO, 
  EditReservationDTO,
  ReservationRoomDTO,
  ReservationPaymentDTO,
  OperatorDTO,
  HotelDTO,
  ReservationStatusDTO,
  HotelRoomDTO,
  FeedingTypeDTO,
  PaymentTypeDTO,
  PaymentChannelDTO,
  ClientDTO,
  BaseGridRequestModel 
} from '../../models/reservation.model';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatBadgeModule
  ],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss'
})
export class ReservationsComponent implements OnInit {




  filteredData: any[] = [];



  applySearch(): void {
    const term = (this.searchForm.get('searchTerm')?.value || '').toLowerCase();
    if (!term) {
      this.filteredData = [...this.dataSource.data];
    } else {
      this.filteredData = this.dataSource.data.filter((row: any) => {
        return Object.values(row).some(val =>
          val && val.toString().toLowerCase().includes(term)
        );
      });
    }
  }

  showAllAndRevealHidden() {
    this.filteredData.forEach((row: any) => row.isHidden = false);
    this.applySearch();
  }
  getHiddenCount(): number {
    return this.dataSource.data.filter((row: any) => row.isHidden).length;
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['select', 'hotelName', 'clientName', 'operatorName', 'dateFrom', 'dateTo', 'totalPrice', 'reservationStatusName', 'actions'];
  dataSource = new MatTableDataSource<ReservationDTO>();
  selection = new SelectionModel<ReservationDTO>(true, []);
  
  reservationForm: FormGroup;
  searchForm: FormGroup;

  math = Math;
  
  isLoading = false;
  isEditing = false;
  showAddForm = false;
  
  totalCount = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions = [10, 25, 50, 100];

  // Dropdown data
  operators: OperatorDTO[] = [];
  hotels: HotelDTO[] = [];
  reservationStatuses: ReservationStatusDTO[] = [];
  hotelRooms: HotelRoomDTO[] = [];
  feedingTypes: FeedingTypeDTO[] = [];
  paymentTypes: PaymentTypeDTO[] = [];
  paymentChannels: PaymentChannelDTO[] = [];
  clients: ClientDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private reservationsService: ReservationsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.reservationForm = this.fb.group({
      id: [null],
      hotelId: [null, [Validators.required]],
      clientId: [null, [Validators.required]],
      operatorId: [null, [Validators.required]],
      reservationStatusId: [null, [Validators.required]],
      dateFrom: [null, [Validators.required]],
      dateTo: [null, [Validators.required]],
      customerNotes: [''],
      totalPrice: [null, [Validators.min(0)]],
      reservationRooms: this.fb.array([]),
      reservationPayments: this.fb.array([])
    });

    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  ngOnInit(): void {
    this.loadReservations();
    this.loadDropdownData();
    // Setup search functionality
    this.searchForm.get('searchTerm')?.valueChanges.subscribe(() => {
      this.applySearch();
    });
    // Watch hotel changes to load rooms
    this.reservationForm.get('hotelId')?.valueChanges.subscribe(hotelId => {
      if (hotelId) {
        this.loadHotelRooms(hotelId);
      }
    });
  }

  loadReservations(): void {
    this.isLoading = true;
    const request: BaseGridRequestModel = {
      page: this.currentPage + 1,
      pageSize: this.pageSize,
      searchTerm: ''
    };
    this.reservationsService.getAll(request).subscribe({
      next: (response) => {
        this.dataSource.data = response.data || response.records || [];
        this.filteredData = [...this.dataSource.data];
        this.totalCount = response.totalCount || response.totalRecordsCount || 0;
        this.isLoading = false;
        // Clear selection when data changes
        this.selection.clear();
        this.applySearch();
      },
      error: (error) => {
        console.error('Error loading reservations:', error);
        this.showSnackBar('Грешка при зареждане на резервациите');
        this.isLoading = false;
      }
    });
  }

  loadDropdownData(): void {
    // Load all dropdown data
    this.reservationsService.getAllOperators().subscribe(data => this.operators = data);
    this.reservationsService.getAllHotels().subscribe(data => this.hotels = data);
    this.reservationsService.getAllReservationStatuses().subscribe(data => this.reservationStatuses = data);
    this.reservationsService.getAllFeedingTypes().subscribe(data => this.feedingTypes = data);
    this.reservationsService.getAllPaymentTypes().subscribe(data => this.paymentTypes = data);
    this.reservationsService.getAllPaymentChannels().subscribe(data => this.paymentChannels = data);
    this.reservationsService.getAllClients().subscribe(data => this.clients = data);
  }

  loadHotelRooms(hotelId: number): void {
    this.reservationsService.getAllHotelRooms(hotelId).subscribe({
      next: (rooms) => {
        this.hotelRooms = rooms;
      },
      error: (error) => {
        console.error('Error loading hotel rooms:', error);
      }
    });
  }

  // FormArray getters
  get reservationRooms(): FormArray {
    return this.reservationForm.get('reservationRooms') as FormArray;
  }

  get reservationPayments(): FormArray {
    return this.reservationForm.get('reservationPayments') as FormArray;
  }

  // Room management
  addRoom(): void {
    const roomForm = this.fb.group({
      id: [null],
      adults: [1, [Validators.min(0)]],
      children: [0, [Validators.min(0)]],
      babies: [0, [Validators.min(0)]],
      price: [null, [Validators.min(0)]],
      hotelRoomId: [null, [Validators.required]],
      feedingTypeId: [null],
      isActive: [true]
    });
    
    this.reservationRooms.push(roomForm);
  }

  removeRoom(index: number): void {
    this.reservationRooms.removeAt(index);
  }

  // Payment management
  addPayment(): void {
    const paymentForm = this.fb.group({
      id: [null],
      dueDate: [null, [Validators.required]],
      paymentTypeId: [null, [Validators.required]],
      paymentChannelId: [null, [Validators.required]],
      amount: [null, [Validators.required, Validators.min(0)]],
      isPaid: [false],
      isActive: [true]
    });
    
    this.reservationPayments.push(paymentForm);
  }

  removePayment(index: number): void {
    this.reservationPayments.removeAt(index);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadReservations();
  }

  showAddReservationForm(): void {
    this.loadDropdownData(); // Always reload dropdowns (hotels, etc.)
    this.showAddForm = true;
    this.isEditing = false;
    this.reservationForm.reset();
    this.clearFormArrays();
    this.addRoom(); // Add one room by default
    this.addPayment(); // Add one payment by default
  }

  editReservation(reservation: ReservationDTO): void {
    this.showAddForm = true;
    this.isEditing = true;
    
    // Load hotel rooms first if hotel is selected
    if (reservation.hotelId) {
      this.loadHotelRooms(reservation.hotelId);
    }
    
    this.reservationForm.patchValue({
      id: reservation.id,
      hotelId: reservation.hotelId,
      clientId: reservation.clientId,
      operatorId: reservation.operatorId,
      reservationStatusId: reservation.reservationStatusId,
      dateFrom: reservation.dateFrom ? new Date(reservation.dateFrom) : null,
      dateTo: reservation.dateTo ? new Date(reservation.dateTo) : null,
      customerNotes: reservation.customerNotes,
      totalPrice: reservation.totalPrice
    });

    // Clear and populate rooms
    this.clearFormArrays();
    if (reservation.reservationRooms && reservation.reservationRooms.length > 0) {
      reservation.reservationRooms.forEach(room => {
        const roomForm = this.fb.group({
          id: [room.id],
          adults: [room.adults || 1],
          children: [room.children || 0],
          babies: [room.babies || 0],
          price: [room.price],
          hotelRoomId: [room.hotelRoomId],
          feedingTypeId: [room.feedingTypeId],
          isActive: [room.isActive !== false]
        });
        this.reservationRooms.push(roomForm);
      });
    } else {
      this.addRoom();
    }

    // Clear and populate payments
    if (reservation.reservationPayments && reservation.reservationPayments.length > 0) {
      reservation.reservationPayments.forEach(payment => {
        const paymentForm = this.fb.group({
          id: [payment.id],
          dueDate: [payment.dueDate ? new Date(payment.dueDate) : null],
          paymentTypeId: [payment.paymentTypeId],
          paymentChannelId: [payment.paymentChannelId],
          amount: [payment.amount],
          isPaid: [payment.isPaid || false],
          isActive: [payment.isActive !== false]
        });
        this.reservationPayments.push(paymentForm);
      });
    } else {
      this.addPayment();
    }
  }

  private clearFormArrays(): void {
    while (this.reservationRooms.length !== 0) {
      this.reservationRooms.removeAt(0);
    }
    while (this.reservationPayments.length !== 0) {
      this.reservationPayments.removeAt(0);
    }
  }

  cancelForm(): void {
    this.showAddForm = false;
    this.isEditing = false;
    this.reservationForm.reset();
    this.clearFormArrays();
  }

  saveReservation(): void {
    if (this.reservationForm.valid) {
      this.isLoading = true;
      const reservationData: EditReservationDTO = {
        ...this.reservationForm.value,
        dateFrom: this.reservationForm.value.dateFrom?.toISOString(),
        dateTo: this.reservationForm.value.dateTo?.toISOString(),
        reservationPayments: this.reservationForm.value.reservationPayments?.map((payment: any) => ({
          ...payment,
          dueDate: payment.dueDate?.toISOString()
        }))
      };

      this.reservationsService.addOrUpdate(reservationData).subscribe({
        next: () => {
          this.showSnackBar(this.isEditing ? 'Резервацията е обновена успешно' : 'Резервацията е добавена успешно');
          this.cancelForm();
          this.loadReservations();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error saving reservation:', error);
          this.showSnackBar('Грешка при запазване на резервацията');
          this.isLoading = false;
        }
      });
    }
  }

  deleteReservation(reservation: ReservationDTO): void {
    if (reservation.id && confirm(`Сигурни ли сте, че искате да изтриете резервацията?`)) {
      this.isLoading = true;
      
      this.reservationsService.delete(reservation.id).subscribe({
        next: () => {
          this.showSnackBar('Резервацията е изтрита успешно');
          this.loadReservations();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error deleting reservation:', error);
          this.showSnackBar('Грешка при изтриване на резервацията');
          this.isLoading = false;
        }
      });
    }
  }

  formatPrice(price: number | null | undefined): string {
    if (!price) return 'Не е указана';
    return `${price.toFixed(2)} лв.`;
  }

  formatDate(date: string | null | undefined): string {
    if (!date) return 'Не е указана';
    return new Date(date).toLocaleDateString('bg-BG');
  }

  // Selection methods
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Затвори', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  // Form validation helpers
  getErrorMessage(fieldName: string): string {
    const field = this.reservationForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Това поле е задължително';
    }
    if (field?.hasError('min')) {
      return 'Стойността трябва да е положителна';
    }
    return '';
  }

  // Pagination helpers
  getStartRecord(): number {
    if (!this.totalCount || this.totalCount === 0) return 0;
    return this.currentPage * this.pageSize + 1;
  }

  getEndRecord(): number {
    if (!this.totalCount || this.totalCount === 0) return 0;
    const endRecord = Math.min((this.currentPage + 1) * this.pageSize, this.totalCount);
    return isNaN(endRecord) ? 0 : endRecord;
  }
}