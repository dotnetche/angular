import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TourOperatorDTO, BaseGridRequestModel, GridResponse } from '../models/tour-operator.model';

@Injectable({
  providedIn: 'root'
})
export class TourOperatorsService {
  private readonly baseUrl = 'https://api.example.com'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getAll(request: BaseGridRequestModel): Observable<GridResponse<TourOperatorDTO>> {
    return this.http.post<GridResponse<TourOperatorDTO>>(`${this.baseUrl}/TourOperators/GetAll`, request);
  }

  getTourOperator(id: number): Observable<TourOperatorDTO> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<TourOperatorDTO>(`${this.baseUrl}/TourOperators/Get`, { params });
  }

  addOrUpdate(tourOperator: TourOperatorDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/TourOperators/AddOrUpdate`, tourOperator);
  }

  delete(id: number): Observable<any> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete(`${this.baseUrl}/TourOperators/Delete`, { params });
  }
}