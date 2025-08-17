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
import { SelectionModel } from '@angular/cdk/collections';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PaymentTypesService } from '../../services/payment-types.service';
import { PaymentTypeDTO, BaseGridRequestModel } from '../../models/payment-type.model';

@Component({
  selector: 'app-payment-types',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './payment-types.component.html',
  styleUrl: './payment-types.component.scss'
})
export class PaymentTypesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['select', 'name', 'actions'];
  dataSource = new MatTableDataSource<PaymentTypeDTO>();
  selection = new SelectionModel<PaymentTypeDTO>(true, []);
  
  paymentTypeForm: FormGroup;
  searchForm: FormGroup;

  math = Math;
  
  isLoading = false;
  isEditing = false;
  showAddForm = false;
  
  totalCount = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions = [10, 25, 50, 100];

  constructor(
    private fb: FormBuilder,
    private paymentTypesService: PaymentTypesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.paymentTypeForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.maxLength(200)]]
    });

    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  ngOnInit(): void {
    this.loadPaymentTypes();
    
    // Setup search functionality
    this.searchForm.get('searchTerm')?.valueChanges.subscribe(() => {
      this.currentPage = 0;
      this.loadPaymentTypes();
    });
  }

  loadPaymentTypes(): void {
    this.isLoading = true;
    
    const request: BaseGridRequestModel = {
      page: this.currentPage + 1,
      pageSize: this.pageSize,
      searchTerm: this.searchForm.get('searchTerm')?.value || ''
    };

    this.paymentTypesService.getAll(request).subscribe({
      next: (response) => {
        this.dataSource.data = response.data || response.records || [];
        this.totalCount = response.totalCount || response.totalRecordsCount || 0;
        this.isLoading = false;
        
        // Clear selection when data changes
        this.selection.clear();
      },
      error: (error) => {
        console.error('Error loading payment types:', error);
        this.showSnackBar('Грешка при зареждане на начините на плащане');
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPaymentTypes();
  }

  showAddPaymentTypeForm(): void {
    this.showAddForm = true;
    this.isEditing = false;
    this.paymentTypeForm.reset();
  }

  editPaymentType(paymentType: PaymentTypeDTO): void {
    this.showAddForm = true;
    this.isEditing = true;
    this.paymentTypeForm.patchValue(paymentType);
  }

  cancelForm(): void {
    this.showAddForm = false;
    this.isEditing = false;
    this.paymentTypeForm.reset();
  }

  savePaymentType(): void {
    if (this.paymentTypeForm.valid) {
      this.isLoading = true;
      const paymentTypeData = this.paymentTypeForm.value;

      this.paymentTypesService.addOrUpdate(paymentTypeData).subscribe({
        next: () => {
          this.showSnackBar(this.isEditing ? 'Начинът на плащане е обновен успешно' : 'Начинът на плащане е добавен успешно');
          this.cancelForm();
          this.loadPaymentTypes();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error saving payment type:', error);
          this.showSnackBar('Грешка при запазване на начина на плащане');
          this.isLoading = false;
        }
      });
    }
  }

  saveAndAddAnother(): void {
    if (this.paymentTypeForm.valid) {
      this.isLoading = true;
      const paymentTypeData = this.paymentTypeForm.value;

      this.paymentTypesService.addOrUpdate(paymentTypeData).subscribe({
        next: () => {
          this.showSnackBar('Начинът на плащане е добавен успешно');
          this.paymentTypeForm.reset();
          this.loadPaymentTypes();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error saving payment type:', error);
          this.showSnackBar('Грешка при запазване на начина на плащане');
          this.isLoading = false;
        }
      });
    }
  }

  deletePaymentType(paymentType: PaymentTypeDTO): void {
    if (paymentType.id && confirm(`Сигурни ли сте, че искате да изтриете начина на плащане "${paymentType.name}"?`)) {
      this.isLoading = true;
      
      this.paymentTypesService.delete(paymentType.id).subscribe({
        next: () => {
          this.showSnackBar('Начинът на плащане е изтрит успешно');
          this.loadPaymentTypes();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error deleting payment type:', error);
          this.showSnackBar('Грешка при изтриване на начина на плащане');
          this.isLoading = false;
        }
      });
    }
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
    const field = this.paymentTypeForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Това поле е задължително';
    }
    if (field?.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength']?.requiredLength;
      return `Максимум ${maxLength} символа`;
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