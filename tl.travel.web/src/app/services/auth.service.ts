import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { AuthCredentials, EditOperatorDTO, AuthResponse } from '../models/auth.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {
    // Initialize user from stored token on app start
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
    const token = localStorage.getItem('token');
    if (token) {
      // Try to read token info from server
      this.readToken().subscribe({
        next: (user) => {
          if (user) {
            this.currentUserSubject.next(user);
          }
        },
        error: (error) => {
          console.error('Failed to read token:', error);
          // If token is invalid, clear it but don't redirect yet
          // Let the auth guard handle the redirect
          this.clearTokens();
        }
      });
    }
  }

  private clearTokens(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.currentUserSubject.next(null);
    }
  }

  signIn(credentials: AuthCredentials): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/Security/SignIn', credentials)
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            if (response.refreshToken) {
              localStorage.setItem('refreshToken', response.refreshToken);
            }
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  signUp(operator: EditOperatorDTO): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/Security/SignUp', operator)
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            if (response.refreshToken) {
              localStorage.setItem('refreshToken', response.refreshToken);
            }
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  logout(): Observable<any> {
    // Clear tokens first
    this.clearTokens();
    
    // Try to call logout endpoint, but don't fail if it doesn't work
    return this.apiService.post('/Security/Logout', {}).pipe(
      catchError(() => {
        // Ignore logout endpoint errors
        return new Observable(observer => {
          observer.next(null);
          observer.complete();
        });
      })
    );
  }

  readToken(): Observable<any> {
    return this.apiService.get('/Security/ReadToken').pipe(
      catchError((error) => {
        console.error('ReadToken failed:', error);
        return new Observable(observer => {
          observer.next(null);
          observer.complete();
        });
      })
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
}