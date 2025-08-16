import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TourOperatorDTO, BaseGridRequestModel, GridResponse } from '../models/tour-operator.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TourOperatorsService {

  constructor(private apiService: ApiService) {}

  getAll(request: BaseGridRequestModel): Observable<GridResponse<TourOperatorDTO>> {
    return this.apiService.post<GridResponse<TourOperatorDTO>>('/TourOperators/GetAll', request);
  }

  getTourOperator(id: number): Observable<TourOperatorDTO> {
    const params = new HttpParams().set('id', id.toString());
    return this.apiService.get<TourOperatorDTO>('/TourOperators/Get', params);
  }

  addOrUpdate(tourOperator: TourOperatorDTO): Observable<any> {
    return this.apiService.post('/TourOperators/AddOrUpdate', tourOperator);
  }

  delete(id: number): Observable<any> {
    const params = new HttpParams().set('id', id.toString());
    return this.apiService.delete('/TourOperators/Delete', params);
  }
}