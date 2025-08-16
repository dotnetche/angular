import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StatisticsResponse } from '../models/auth.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private apiService: ApiService) {}

  getHotelsReservationsCount(): Observable<StatisticsResponse[]> {
    return this.apiService.get<StatisticsResponse[]>('/Statistics/GetHotelsReservationsCount');
  }

  getClientsReservationsCount(): Observable<StatisticsResponse[]> {
    return this.apiService.get<StatisticsResponse[]>('/Statistics/GetClientsReservationsCount');
  }
}