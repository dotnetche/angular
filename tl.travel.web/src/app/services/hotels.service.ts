import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HotelDTO, LocationDTO, PartnerDTO, BaseGridRequestModel, GridResponse } from '../models/hotel.model';

@Injectable({
  providedIn: 'root'
})
export class HotelsService {
  private readonly baseUrl = 'https://api.example.com'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getAll(request: BaseGridRequestModel): Observable<GridResponse<HotelDTO>> {
    return this.http.post<GridResponse<HotelDTO>>(`${this.baseUrl}/Hotels/GetAll`, request);
  }

  getHotel(id: number): Observable<HotelDTO> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<HotelDTO>(`${this.baseUrl}/Hotels/Get`, { params });
  }

  getAllLocations(): Observable<LocationDTO[]> {
    return this.http.get<LocationDTO[]>(`${this.baseUrl}/Hotels/GetAllLocations`);
  }

  getAllOperators(): Observable<PartnerDTO[]> {
    return this.http.get<PartnerDTO[]>(`${this.baseUrl}/Hotels/GetAllOperators`);
  }

  getAllAgents(): Observable<PartnerDTO[]> {
    return this.http.get<PartnerDTO[]>(`${this.baseUrl}/Hotels/GetAllAgents`);
  }

  addOrUpdate(hotel: HotelDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/Hotels/AddOrUpdate`, hotel);
  }

  delete(id: number): Observable<any> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete(`${this.baseUrl}/Hotels/Delete`, { params });
  }
}