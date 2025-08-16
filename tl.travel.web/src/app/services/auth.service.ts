import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthCredentials, EditOperatorDTO, AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'https://api.example.com'; // Replace with your actual API URL
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
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
    return this.http.post<AuthResponse>(`${this.baseUrl}/Security/SignIn`, credentials)
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
    return this.http.post<AuthResponse>(`${this.baseUrl}/Security/SignUp`, operator)
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
    return this.http.post(`${this.baseUrl}/Security/Logout`, {})
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
    return this.http.post<AuthResponse>(`${this.baseUrl}/Security/RefreshToken`, { refreshToken })
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
    return this.http.get(`${this.baseUrl}/Security/ReadToken`);
  }

  getCSRFToken(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Security/GetCSRFToken`);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}