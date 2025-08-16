import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { SelectionModel } from '@angular/cdk/collections';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { HotelRoomsService } from '../../services/hotel-rooms.service';
import { HotelRoomDTO, HotelDTO, BaseGridRequestModel } from '../../models/hotel-room.model';

@Component({
  selector: 'app-hotel-rooms',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './hotel-rooms.component.html',
  styleUrl: './hotel-rooms.component.scss'
})
export class HotelRoomsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['select', 'name', 'hotelName', 'price', 'maxAdults', 'maxChildren', 'maxBabies', 'description', 'actions'];
  dataSource = new MatTableDataSource<HotelRoomDTO>();
  selection = new SelectionModel<HotelRoomDTO>(true, []);
  
  hotelRoomForm: FormGroup;
  searchForm: FormGroup;

  math = Math;
  
  isLoading = false;
  isEditing = false;
  showAddForm = false;
  
  totalCount = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions = [10, 25, 50, 100];

  hotels: HotelDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private hotelRoomsService: HotelRoomsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.hotelRoomForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.maxLength(200)]],
      hotelId: [null, [Validators.required]],
      price: [null, [Validators.min(0)]],
      description: [''],
      maxAdults: [null, [Validators.min(0)]],
      maxChildren: [null, [Validators.min(0)]],
      maxBabies: [null, [Validators.min(0)]]
    });

    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  ngOnInit(): void {
    this.loadHotelRooms();
    this.loadHotels();
    
    // Setup search functionality
    this.searchForm.get('searchTerm')?.valueChanges.subscribe(() => {
      this.currentPage = 0;
      this.loadHotelRooms();
    });
  }

  loadHotelRooms(): void {
    this.isLoading = true;
    
    const request: BaseGridRequestModel = {
      page: this.currentPage + 1,
      pageSize: this.pageSize,
      searchTerm: this.searchForm.get('searchTerm')?.value || ''
    };

    this.hotelRoomsService.getAll(request).subscribe({
      next: (response) => {
        this.dataSource.data = response.data || response.records || [];
        this.totalCount = response.totalCount || response.totalRecordsCount || 0;
        this.isLoading = false;
        
        // Clear selection when data changes
        this.selection.clear();
      },
      error: (error) => {
        console.error('Error loading hotel rooms:', error);
        this.showSnackBar('Грешка при зареждане на стаите');
        this.isLoading = false;
      }
    });
  }

  loadHotels(): void {
    this.hotelRoomsService.getAllHotels().subscribe({
      next: (hotels) => {
        this.hotels = hotels;
      },
      error: (error) => {
        console.error('Error loading hotels:', error);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadHotelRooms();
  }

  showAddHotelRoomForm(): void {
    this.showAddForm = true;
    this.isEditing = false;
    this.hotelRoomForm.reset();
  }

  editHotelRoom(hotelRoom: HotelRoomDTO): void {
    this.showAddForm = true;
    this.isEditing = true;
    this.hotelRoomForm.patchValue(hotelRoom);
  }

  cancelForm(): void {
    this.showAddForm = false;
    this.isEditing = false;
    this.hotelRoomForm.reset();
  }

  saveHotelRoom(): void {
    if (this.hotelRoomForm.valid) {
      this.isLoading = true;
      const hotelRoomData = this.hotelRoomForm.value;

      this.hotelRoomsService.addOrUpdate(hotelRoomData).subscribe({
        next: () => {
          this.showSnackBar(this.isEditing ? 'Стаята е обновена успешно' : 'Стаята е добавена успешно');
          this.cancelForm();
          this.loadHotelRooms();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error saving hotel room:', error);
          this.showSnackBar('Грешка при запазване на стаята');
          this.isLoading = false;
        }
      });
    }
  }

  saveAndAddAnother(): void {
    if (this.hotelRoomForm.valid) {
      this.isLoading = true;
      const hotelRoomData = this.hotelRoomForm.value;

      this.hotelRoomsService.addOrUpdate(hotelRoomData).subscribe({
        next: () => {
          this.showSnackBar('Стаята е добавена успешно');
          this.hotelRoomForm.reset();
          this.loadHotelRooms();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error saving hotel room:', error);
          this.showSnackBar('Грешка при запазване на стаята');
          this.isLoading = false;
        }
      });
    }
  }

  deleteHotelRoom(hotelRoom: HotelRoomDTO): void {
    if (hotelRoom.id && confirm(`Сигурни ли сте, че искате да изтриете стаята "${hotelRoom.name}"?`)) {
      this.isLoading = true;
      
      this.hotelRoomsService.delete(hotelRoom.id).subscribe({
        next: () => {
          this.showSnackBar('Стаята е изтрита успешно');
          this.loadHotelRooms();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error deleting hotel room:', error);
          this.showSnackBar('Грешка при изтриване на стаята');
          this.isLoading = false;
        }
      });
    }
  }

  formatPrice(price: number | null | undefined): string {
    if (!price) return 'Не е указана';
    return `${price.toFixed(2)} лв.`;
  }

  formatCapacity(adults?: number, children?: number, babies?: number): string {
    const parts = [];
    if (adults) parts.push(`${adults} възр.`);
    if (children) parts.push(`${children} деца`);
    if (babies) parts.push(`${babies} бебета`);
    return parts.length > 0 ? parts.join(', ') : 'Не е указано';
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
    const field = this.hotelRoomForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Това поле е задължително';
    }
    if (field?.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength']?.requiredLength;
      return `Максимум ${maxLength} символа`;
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