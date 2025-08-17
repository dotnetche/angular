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

import { FeedingTypesService } from '../../services/feeding-types.service';
import { FeedingTypeDTO, BaseGridRequestModel } from '../../models/feeding-type.model';

@Component({
  selector: 'app-feeding-types',
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
  templateUrl: './feeding-types.component.html',
  styleUrl: './feeding-types.component.scss'
})
export class FeedingTypesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['select', 'code', 'name', 'actions'];
  dataSource = new MatTableDataSource<FeedingTypeDTO>();
  selection = new SelectionModel<FeedingTypeDTO>(true, []);
  
  feedingTypeForm: FormGroup;
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
    private feedingTypesService: FeedingTypesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.feedingTypeForm = this.fb.group({
      id: [null],
      code: ['', [Validators.required, Validators.maxLength(50)]],
      name: ['', [Validators.required, Validators.maxLength(200)]]
    });

    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  ngOnInit(): void {
    this.loadFeedingTypes();
    
    // Setup search functionality
    this.searchForm.get('searchTerm')?.valueChanges.subscribe(() => {
      this.currentPage = 0;
      this.loadFeedingTypes();
    });
  }

  loadFeedingTypes(): void {
    this.isLoading = true;
    
    const request: BaseGridRequestModel = {
      page: this.currentPage + 1,
      pageSize: this.pageSize,
      searchTerm: this.searchForm.get('searchTerm')?.value || ''
    };

    this.feedingTypesService.getAll(request).subscribe({
      next: (response) => {
        this.dataSource.data = response.data || response.records || [];
        this.totalCount = response.totalCount || response.totalRecordsCount || 0;
        this.isLoading = false;
        
        // Clear selection when data changes
        this.selection.clear();
      },
      error: (error) => {
        console.error('Error loading feeding types:', error);
        this.showSnackBar('Грешка при зареждане на типовете изхранване');
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadFeedingTypes();
  }

  showAddFeedingTypeForm(): void {
    this.showAddForm = true;
    this.isEditing = false;
    this.feedingTypeForm.reset();
  }

  editFeedingType(feedingType: FeedingTypeDTO): void {
    this.showAddForm = true;
    this.isEditing = true;
    this.feedingTypeForm.patchValue(feedingType);
  }

  cancelForm(): void {
    this.showAddForm = false;
    this.isEditing = false;
    this.feedingTypeForm.reset();
  }

  saveFeedingType(): void {
    if (this.feedingTypeForm.valid) {
      this.isLoading = true;
      const feedingTypeData = this.feedingTypeForm.value;

      this.feedingTypesService.addOrUpdate(feedingTypeData).subscribe({
        next: () => {
          this.showSnackBar(this.isEditing ? 'Типът изхранване е обновен успешно' : 'Типът изхранване е добавен успешно');
          this.cancelForm();
          this.loadFeedingTypes();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error saving feeding type:', error);
          this.showSnackBar('Грешка при запазване на типа изхранване');
          this.isLoading = false;
        }
      });
    }
  }

  saveAndAddAnother(): void {
    if (this.feedingTypeForm.valid) {
      this.isLoading = true;
      const feedingTypeData = this.feedingTypeForm.value;

      this.feedingTypesService.addOrUpdate(feedingTypeData).subscribe({
        next: () => {
          this.showSnackBar('Типът изхранване е добавен успешно');
          this.feedingTypeForm.reset();
          this.loadFeedingTypes();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error saving feeding type:', error);
          this.showSnackBar('Грешка при запазване на типа изхранване');
          this.isLoading = false;
        }
      });
    }
  }

  deleteFeedingType(feedingType: FeedingTypeDTO): void {
    if (feedingType.id && confirm(`Сигурни ли сте, че искате да изтриете типа изхранване "${feedingType.name}"?`)) {
      this.isLoading = true;
      
      this.feedingTypesService.delete(feedingType.id).subscribe({
        next: () => {
          this.showSnackBar('Типът изхранване е изтрит успешно');
          this.loadFeedingTypes();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error deleting feeding type:', error);
          this.showSnackBar('Грешка при изтриване на типа изхранване');
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
    const field = this.feedingTypeForm.get(fieldName);
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

  toggleRowExpansion(feedingType: FeedingTypeDTO): void {
    if (feedingType.id) {
      if (this.expandedRows.has(feedingType.id)) {
        this.expandedRows.delete(feedingType.id);
      } else {
        this.expandedRows.add(feedingType.id);
      }
    }
  }

  isRowExpanded(feedingType: FeedingTypeDTO): boolean {
    return feedingType.id ? this.expandedRows.has(feedingType.id) : false;
  }

  hideRow(feedingType: FeedingTypeDTO): void {
  }
}