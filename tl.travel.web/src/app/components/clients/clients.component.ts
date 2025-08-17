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
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { ClientsService } from '../../services/clients.service';
import { ClientDTO, BaseGridRequestModel } from '../../models/client.model';

@Component({
  selector: 'app-clients',
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
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [];
  dynamicColumns: string[] = [];
  dataSource = new MatTableDataSource<ClientDTO>();
  selection = new SelectionModel<ClientDTO>(true, []);
  
  clientForm: FormGroup;
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

  constructor(
    private fb: FormBuilder,
    private clientsService: ClientsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.clientForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
      phone: ['', [Validators.required, Validators.maxLength(50)]]
    });

    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  ngOnInit(): void {
    this.loadClients();
    
    // Setup search functionality
    this.searchForm.get('searchTerm')?.valueChanges.subscribe(() => {
      this.currentPage = 0;
      this.loadClients();
    });
  }

  loadClients(): void {
    this.isLoading = true;
    
    const request: BaseGridRequestModel = {
      page: this.currentPage + 1,
      pageSize: this.pageSize,
      searchTerm: this.searchForm.get('searchTerm')?.value || ''
    };

    this.clientsService.getAll(request).subscribe({
      next: (response) => {
        this.dataSource.data = response.data || response.records || [];
        this.totalCount = response.totalCount || response.totalRecordsCount || 0;
        
        // Generate dynamic columns from data
        this.generateDynamicColumns(this.dataSource.data);
        
        this.isLoading = false;
        
        // Clear selection when data changes
        this.selection.clear();
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.showSnackBar('Грешка при зареждане на клиентите');
        this.isLoading = false;
      }
    });
  }

  generateDynamicColumns(data: ClientDTO[]): void {
    if (data && data.length > 0) {
      // Get all unique property names from the data
      const allProperties = new Set<string>();
      
      data.forEach(item => {
        Object.keys(item).forEach(key => {
          // Skip null/undefined values and functions
          if (item[key as keyof ClientDTO] !== null && 
              item[key as keyof ClientDTO] !== undefined &&
              typeof item[key as keyof ClientDTO] !== 'function') {
            allProperties.add(key);
          }
        });
      });
      
      // Convert to array and sort for consistent order
      this.dynamicColumns = Array.from(allProperties).sort();
      
      // Combine with fixed columns (select and actions)
      this.displayedColumns = ['select', ...this.dynamicColumns, 'actions'];
    } else {
      // Fallback to default columns if no data
      this.dynamicColumns = ['name', 'email', 'phone'];
      this.displayedColumns = ['select', ...this.dynamicColumns, 'actions'];
    }
  }

  getColumnDisplayName(column: string): string {
    // Map column names to user-friendly display names
    const columnMap: { [key: string]: string } = {
      'id': 'ID',
      'name': 'Име',
      'email': 'Имейл',
      'phone': 'Телефон',
      'createdAt': 'Създаден на',
      'updatedAt': 'Обновен на',
      'isActive': 'Активен',
      'address': 'Адрес',
      'company': 'Компания',
      'notes': 'Бележки'
    };
    
    return columnMap[column] || this.capitalizeFirst(column);
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  formatCellValue(value: any): string {
    if (value === null || value === undefined) {
      return '-';
    }
    
    // Format dates
    if (typeof value === 'string' && value.includes('T') && value.includes('Z')) {
      try {
        const date = new Date(value);
        return date.toLocaleDateString('bg-BG');
      } catch {
        return value;
      }
    }
    
    // Format booleans
    if (typeof value === 'boolean') {
      return value ? 'Да' : 'Не';
    }
    
    // Format numbers
    if (typeof value === 'number') {
      return value.toString();
    }
    
    return value.toString();
  }
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadClients();
  }

  showAddClientForm(): void {
    this.showAddForm = true;
    this.isEditing = false;
    this.clientForm.reset();
  }

  editClient(client: ClientDTO): void {
    this.showAddForm = true;
    this.isEditing = true;
    this.clientForm.patchValue(client);
  }

  cancelForm(): void {
    this.showAddForm = false;
    this.isEditing = false;
    this.clientForm.reset();
  }

  saveClient(): void {
    if (this.clientForm.valid) {
      this.isLoading = true;
      const clientData = this.clientForm.value;

      this.clientsService.addOrUpdate(clientData).subscribe({
        next: () => {
          this.showSnackBar(this.isEditing ? 'Клиентът е обновен успешно' : 'Клиентът е добавен успешно');
          this.cancelForm();
          this.loadClients();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error saving client:', error);
          this.showSnackBar('Грешка при запазване на клиента');
          this.isLoading = false;
        }
      });
    }
  }

  saveAndAddAnother(): void {
    if (this.clientForm.valid) {
      this.isLoading = true;
      const clientData = this.clientForm.value;

      this.clientsService.addOrUpdate(clientData).subscribe({
        next: () => {
          this.showSnackBar('Клиентът е добавен успешно');
          this.clientForm.reset();
          this.loadClients();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error saving client:', error);
          this.showSnackBar('Грешка при запазване на клиента');
          this.isLoading = false;
        }
      });
    }
  }

  deleteClient(client: ClientDTO): void {
    if (client.id && confirm(`Сигурни ли сте, че искате да изтриете клиента "${client.name}"?`)) {
      this.isLoading = true;
      
      this.clientsService.delete(client.id).subscribe({
        next: () => {
          this.showSnackBar('Клиентът е изтрит успешно');
          this.loadClients();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error deleting client:', error);
          this.showSnackBar('Грешка при изтриване на клиента');
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
    const field = this.clientForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Това поле е задължително';
    }
    if (field?.hasError('email')) {
      return 'Моля въведете валиден имейл адрес';
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

  toggleRowExpansion(client: ClientDTO): void {
    if (client.id) {
      if (this.expandedRows.has(client.id)) {
        this.expandedRows.delete(client.id);
      } else {
        this.expandedRows.add(client.id);
      }
    }
  }

  isRowExpanded(client: ClientDTO): boolean {
    return client.id ? this.expandedRows.has(client.id) : false;
  }
}