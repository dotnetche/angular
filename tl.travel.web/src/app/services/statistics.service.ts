import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StatisticsResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private readonly baseUrl = 'https://api.example.com'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getHotelsReservationsCount(): Observable<StatisticsResponse> {
    return this.http.get<StatisticsResponse>(`${this.baseUrl}/Statistics/GetHotelsReservationsCount`);
  }

  getClientsReservationsCount(): Observable<StatisticsResponse> {
    return this.http.get<StatisticsResponse>(`${this.baseUrl}/Statistics/GetClientsReservationsCount`);
  }
}