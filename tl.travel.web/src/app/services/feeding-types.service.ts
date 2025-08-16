import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeedingTypeDTO, BaseGridRequestModel, GridResponse } from '../models/feeding-type.model';

@Injectable({
  providedIn: 'root'
})
export class FeedingTypesService {
  private readonly baseUrl = 'https://api.example.com'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getAll(request: BaseGridRequestModel): Observable<GridResponse<FeedingTypeDTO>> {
    return this.http.post<GridResponse<FeedingTypeDTO>>(`${this.baseUrl}/FeedingTypes/GetAll`, request);
  }

  getFeedingType(id: number): Observable<FeedingTypeDTO> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<FeedingTypeDTO>(`${this.baseUrl}/FeedingTypes/Get`, { params });
  }

  addOrUpdate(feedingType: FeedingTypeDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/FeedingTypes/AddOrUpdate`, feedingType);
  }

  delete(id: number): Observable<any> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete(`${this.baseUrl}/FeedingTypes/Delete`, { params });
  }
}