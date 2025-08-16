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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SelectionModel } from '@angular/cdk/collections';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { HotelsService } from '../../services/hotels.service';
import { HotelDTO, LocationDTO, PartnerDTO, BaseGridRequestModel } from '../../models/hotel.model';

@Component({
  selector: 'app-hotels',
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
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.scss'
})
export class HotelsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['select', 'name', 'stars', 'locationName', 'partnerName', 'contacts', 'isTemporaryClosed', 'actions'];
  dataSource = new MatTableDataSource<HotelDTO>();
  selection = new SelectionModel<HotelDTO>(true, []);
  
  hotelForm: FormGroup;
  searchForm: FormGroup;

  math = Math;
  
  isLoading = false;
  isEditing = false;
  showAddForm = false;
  
  totalCount = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions = [10, 25, 50, 100];

  locations: LocationDTO[] = [];
  partners: PartnerDTO[] = [];
  starsOptions = [1, 2, 3, 4, 5];

  constructor(
    private fb: FormBuilder,
    private hotelsService: HotelsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.hotelForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.maxLength(200)]],
      stars: [null],
      contacts: ['', [Validators.required, Validators.maxLength(500)]],
      isTemporaryClosed: [false],
      locationId: [null],
      partnerId: [null]
    });

    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  ngOnInit(): void {
    this.loadHotels();
    this.loadLocations();
    this.loadPartners();
    
    // Setup search functionality
    this.searchForm.get('searchTerm')?.valueChanges.subscribe(() => {
      this.currentPage = 0;
      this.loadHotels();
    });
  }

  loadHotels(): void {
    this.isLoading = true;
    
    const request: BaseGridRequestModel = {
      page: this.currentPage + 1,
      pageSize: this.pageSize,
      searchTerm: this.searchForm.get('searchTerm')?.value || ''
    };

    this.hotelsService.getAll(request).subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.totalCount = response.totalCount;
        this.isLoading = false;
        
        // Clear selection when data changes
        this.selection.clear();
      },
      error: (error) => {
        console.error('Error loading hotels:', error);
        this.showSnackBar('Грешка при зареждане на хотелите');
        this.isLoading = false;
      }
    });
  }

  loadLocations(): void {
    this.hotelsService.getAllLocations().subscribe({
      next: (locations) => {
        this.locations = locations;
      },
      error: (error) => {
        console.error('Error loading locations:', error);
      }
    });
  }

  loadPartners(): void {
    this.hotelsService.getAllOperators().subscribe({
      next: (partners) => {
        this.partners = partners;
      },
      error: (error) => {
        console.error('Error loading partners:', error);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadHotels();
  }

  showAddHotelForm(): void {
    this.showAddForm = true;
    this.isEditing = false;
    this.hotelForm.reset();
    this.hotelForm.patchValue({ isTemporaryClosed: false });
  }

  editHotel(hotel: HotelDTO): void {
    this.showAddForm = true;
    this.isEditing = true;
    this.hotelForm.patchValue(hotel);
  }

  cancelForm(): void {
    this.showAddForm = false;
    this.isEditing = false;
    this.hotelForm.reset();
  }

  saveHotel(): void {
    if (this.hotelForm.valid) {
      this.isLoading = true;
      const hotelData = this.hotelForm.value;

      this.hotelsService.addOrUpdate(hotelData).subscribe({
        next: () => {
          this.showSnackBar(this.isEditing ? 'Хотелът е обновен успешно' : 'Хотелът е добавен успешно');
          this.cancelForm();
          this.loadHotels();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error saving hotel:', error);
          this.showSnackBar('Грешка при запазване на хотела');
          this.isLoading = false;
        }
      });
    }
  }

  saveAndAddAnother(): void {
    if (this.hotelForm.valid) {
      this.isLoading = true;
      const hotelData = this.hotelForm.value;

      this.hotelsService.addOrUpdate(hotelData).subscribe({
        next: () => {
          this.showSnackBar('Хотелът е добавен успешно');
          this.hotelForm.reset();
          this.hotelForm.patchValue({ isTemporaryClosed: false });
          this.loadHotels();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error saving hotel:', error);
          this.showSnackBar('Грешка при запазване на хотела');
          this.isLoading = false;
        }
      });
    }
  }

  deleteHotel(hotel: HotelDTO): void {
    if (hotel.id && confirm(`Сигурни ли сте, че искате да изтриете хотела "${hotel.name}"?`)) {
      this.isLoading = true;
      
      this.hotelsService.delete(hotel.id).subscribe({
        next: () => {
          this.showSnackBar('Хотелът е изтрит успешно');
          this.loadHotels();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error deleting hotel:', error);
          this.showSnackBar('Грешка при изтриване на хотела');
          this.isLoading = false;
        }
      });
    }
  }

  getStarsDisplay(stars: number | null | undefined): string {
    if (!stars) return 'Без категория';
    return '★'.repeat(stars);
  }

  getStatusDisplay(isTemporaryClosed: boolean | undefined): string {
    return isTemporaryClosed ? 'Временно затворен' : 'Активен';
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
    const field = this.hotelForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Това поле е задължително';
    }
    if (field?.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength']?.requiredLength;
      return `Максимум ${maxLength} символа`;
    }
    return '';
  }
}