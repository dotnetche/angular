import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
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
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      this.readToken().subscribe({
        next: (user) => this.currentUserSubject.next(user),
        error: () => this.logout()
      });
    }
  }

  signIn(credentials: AuthCredentials): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/Security/SignIn', credentials)
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('refreshToken', response.refreshToken);
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
            localStorage.setItem('refreshToken', response.refreshToken);
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  logout(): Observable<any> {
    return this.apiService.post('/Security/Logout', {})
      .pipe(
        tap(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          this.currentUserSubject.next(null);
        })
      );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.apiService.post<AuthResponse>('/Security/RefreshToken', { refreshToken })
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('refreshToken', response.refreshToken);
          }
        })
      );
  }

  readToken(): Observable<any> {
    return this.apiService.get('/Security/ReadToken');
  }

  getCSRFToken(): Observable<any> {
    return this.apiService.get('/Security/GetCSRFToken');
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