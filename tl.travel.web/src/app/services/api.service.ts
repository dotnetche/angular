import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // GET request
  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { params });
  }

  // POST request
  post<T>(endpoint: string, data?: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data);
  }

  // PUT request
  put<T>(endpoint: string, data?: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data);
  }

  // DELETE request
  delete<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, { params });
  }

  // Get base URL for direct access if needed
  getBaseUrl(): string {
    return this.baseUrl;
  }
}