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

  displayedColumns: string[] = ['select', 'name', 'email', 'phone', 'actions'];
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
        this.dataSource.data = response.data;
        this.totalCount = response.totalCount;
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
}