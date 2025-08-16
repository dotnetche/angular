import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HotelDTO, LocationDTO, PartnerDTO, BaseGridRequestModel, GridResponse } from '../models/hotel.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class HotelsService {

  constructor(private apiService: ApiService) {}

  getAll(request: BaseGridRequestModel): Observable<GridResponse<HotelDTO>> {
    return this.apiService.post<GridResponse<HotelDTO>>('/Hotels/GetAll', request);
  }

  getHotel(id: number): Observable<HotelDTO> {
    const params = new HttpParams().set('id', id.toString());
    return this.apiService.get<HotelDTO>('/Hotels/Get', params);
  }

  getAllLocations(): Observable<LocationDTO[]> {
    return this.apiService.get<LocationDTO[]>('/Hotels/GetAllLocations');
  }

  getAllOperators(): Observable<PartnerDTO[]> {
    return this.apiService.get<PartnerDTO[]>('/Hotels/GetAllOperators');
  }

  getAllAgents(): Observable<PartnerDTO[]> {
    return this.apiService.get<PartnerDTO[]>('/Hotels/GetAllAgents');
  }

  addOrUpdate(hotel: HotelDTO): Observable<any> {
    return this.apiService.post('/Hotels/AddOrUpdate', hotel);
  }

  delete(id: number): Observable<any> {
    const params = new HttpParams().set('id', id.toString());
    return this.apiService.delete('/Hotels/Delete', params);
  }
}