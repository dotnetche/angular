import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { StatisticsService } from '../../services/statistics.service';
import { AuthService } from '../../services/auth.service';
import { StatisticsResponse } from '../../models/auth.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  currentUser: any = null;
  
  hotelReservations: StatisticsResponse = { count: 0, label: 'Резервации на хотели' };
  clientReservations: StatisticsResponse = { count: 0, label: 'Резервации на клиенти' };

  constructor(
    private statisticsService: StatisticsService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadStatistics();
  }

  loadUserData(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  loadStatistics(): void {
    this.isLoading = true;

    // Only load statistics if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.isLoading = false;
      return;
    }

    // Load hotel reservations count
    this.statisticsService.getHotelsReservationsCount().subscribe({
      next: (data) => {
        this.hotelReservations = data;
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading hotel reservations:', error);
        this.hotelReservations = { count: 0, label: 'Резервации на хотели' };
        this.showSnackBar('Грешка при зареждане на статистиките');
        this.checkLoadingComplete();
      }
    });

    // Load client reservations count
    this.statisticsService.getClientsReservationsCount().subscribe({
      next: (data) => {
        this.clientReservations = data;
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading client reservations:', error);
        this.clientReservations = { count: 0, label: 'Резервации на клиенти' };
        this.showSnackBar('Грешка при зареждане на статистиките');
        this.checkLoadingComplete();
      }
    });
  }

  private checkLoadingComplete(): void {
    // Simple check - in a real app you might want more sophisticated loading state management
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  refreshData(): void {
    this.loadStatistics();
    this.showSnackBar('Данните са обновени');
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Затвори', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  getTotalReservations(): number {
    return this.hotelReservations.count + this.clientReservations.count;
  }

  getWelcomeMessage(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Добро утро';
    if (hour < 18) return 'Добър ден';
    return 'Добър вечер';
  }
}