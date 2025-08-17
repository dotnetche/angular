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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SelectionModel } from '@angular/cdk/collections';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TourOperatorsService } from '../../services/tour-operators.service';
import { TourOperatorDTO, BaseGridRequestModel } from '../../models/tour-operator.model';

@Component({
  selector: 'app-tour-operators',
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
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './tour-operators.component.html',
  styleUrl: './tour-operators.component.scss'
})
export class TourOperatorsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['select', 'name', 'commissionPercent', 'isActive', 'actions'];
  dataSource = new MatTableDataSource<TourOperatorDTO>();
  selection = new SelectionModel<TourOperatorDTO>(true, []);
  
  tourOperatorForm: FormGroup;
  searchForm: FormGroup;

  math = Math;
  
  isLoading = false;
  isEditing = false;
  showAddForm = false;
  
  totalCount = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions = [10, 25, 50, 100];

  expandedRows = new Set<number>();
  hiddenRows = new Set<number>();

  constructor(
    private fb: FormBuilder,
    private tourOperatorsService: TourOperatorsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.tourOperatorForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.maxLength(200)]],
      commissionPercent: [null, [Validators.min(0), Validators.max(100)]],
      isActive: [true]
    });

    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  ngOnInit(): void {
    this.loadTourOperators();
    
    // Setup search functionality
    this.searchForm.get('searchTerm')?.valueChanges.subscribe(() => {
      this.currentPage = 0;
      this.loadTourOperators();
    });
  }

  loadTourOperators(): void {
    this.isLoading = true;
    
    const request: BaseGridRequestModel = {
      page: this.currentPage + 1,
      pageSize: this.pageSize,
      searchTerm: this.searchForm.get('searchTerm')?.value || ''
    };

    this.tourOperatorsService.getAll(request).subscribe({
      next: (response) => {
        this.dataSource.data = response.data || response.records || [];
        this.totalCount = response.totalCount || response.totalRecordsCount || 0;
        this.isLoading = false;
        
        // Clear selection when data changes
        this.selection.clear();
      },
      error: (error) => {
        console.error('Error loading tour operators:', error);
        this.showSnackBar('Грешка при зареждане на туристическите оператори');
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTourOperators();
  }

  showAddTourOperatorForm(): void {
    this.showAddForm = true;
    this.isEditing = false;
    this.tourOperatorForm.reset();
    this.tourOperatorForm.patchValue({ isActive: true });
  }

  editTourOperator(tourOperator: TourOperatorDTO): void {
    this.showAddForm = true;
    this.isEditing = true;
    this.tourOperatorForm.patchValue(tourOperator);
  }

  cancelForm(): void {
    this.showAddForm = false;
    this.isEditing = false;
    this.tourOperatorForm.reset();
  }

  saveTourOperator(): void {
    if (this.tourOperatorForm.valid) {
      this.isLoading = true;
      const tourOperatorData = this.tourOperatorForm.value;

      this.tourOperatorsService.addOrUpdate(tourOperatorData).subscribe({
        next: () => {
          this.showSnackBar(this.isEditing ? 'Туристическият оператор е обновен успешно' : 'Туристическият оператор е добавен успешно');
          this.cancelForm();
          this.loadTourOperators();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error saving tour operator:', error);
          this.showSnackBar('Грешка при запазване на туристическия оператор');
          this.isLoading = false;
        }
      });
    }
  }

  saveAndAddAnother(): void {
    if (this.tourOperatorForm.valid) {
      this.isLoading = true;
      const tourOperatorData = this.tourOperatorForm.value;

      this.tourOperatorsService.addOrUpdate(tourOperatorData).subscribe({
        next: () => {
          this.showSnackBar('Туристическият оператор е добавен успешно');
          this.tourOperatorForm.reset();
          this.tourOperatorForm.patchValue({ isActive: true });
          this.loadTourOperators();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error saving tour operator:', error);
          this.showSnackBar('Грешка при запазване на туристическия оператор');
          this.isLoading = false;
        }
      });
    }
  }

  deleteTourOperator(tourOperator: TourOperatorDTO): void {
    if (tourOperator.id && confirm(`Сигурни ли сте, че искате да изтриете туристическия оператор "${tourOperator.name}"?`)) {
      this.isLoading = true;
      
      this.tourOperatorsService.delete(tourOperator.id).subscribe({
        next: () => {
          this.showSnackBar('Туристическият оператор е изтрит успешно');
          this.loadTourOperators();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error deleting tour operator:', error);
          this.showSnackBar('Грешка при изтриване на туристическия оператор');
          this.isLoading = false;
        }
      });
    }
  }

  formatCommission(commission: number | null | undefined): string {
    if (!commission && commission !== 0) return 'Не е указана';
    return `${commission.toFixed(2)}%`;
  }

  getStatusDisplay(isActive: boolean | undefined): string {
    return isActive ? 'Активен' : 'Неактивен';
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
    const field = this.tourOperatorForm.get(fieldName);
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
    if (field?.hasError('max')) {
      return 'Максимум 100%';
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

  toggleRowExpansion(operator: TourOperatorDTO): void {
    if (operator.id) {
      if (this.expandedRows.has(operator.id)) {
        this.expandedRows.delete(operator.id);
      } else {
        this.expandedRows.add(operator.id);
      }
    }
  }

  isRowExpanded(operator: TourOperatorDTO): boolean {
    return operator.id ? this.expandedRows.has(operator.id) : false;
  }

  hideRow(operator: TourOperatorDTO): void {
}