import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeedingTypeDTO, BaseGridRequestModel, GridResponse } from '../models/feeding-type.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class FeedingTypesService {

  constructor(private apiService: ApiService) {}

  getAll(request: BaseGridRequestModel): Observable<GridResponse<FeedingTypeDTO>> {
    return this.apiService.post<GridResponse<FeedingTypeDTO>>('/FeedingTypes/GetAll', request);
  }

  getFeedingType(id: number): Observable<FeedingTypeDTO> {
    const params = new HttpParams().set('id', id.toString());
    return this.apiService.get<FeedingTypeDTO>('/FeedingTypes/Get', params);
  }

  addOrUpdate(feedingType: FeedingTypeDTO): Observable<any> {
    return this.apiService.post('/FeedingTypes/AddOrUpdate', feedingType);
  }

  delete(id: number): Observable<any> {
    const params = new HttpParams().set('id', id.toString());
    return this.apiService.delete('/FeedingTypes/Delete', params);
  }
}