import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HotelRoomDTO, HotelDTO, BaseGridRequestModel, GridResponse } from '../models/hotel-room.model';

@Injectable({
  providedIn: 'root'
})
export class HotelRoomsService {
  private readonly baseUrl = 'https://api.example.com'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getAll(request: BaseGridRequestModel): Observable<GridResponse<HotelRoomDTO>> {
    return this.http.post<GridResponse<HotelRoomDTO>>(`${this.baseUrl}/HotelRooms/GetAll`, request);
  }

  getHotelRoom(id: number): Observable<HotelRoomDTO> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<HotelRoomDTO>(`${this.baseUrl}/HotelRooms/Get`, { params });
  }

  getAllHotels(): Observable<HotelDTO[]> {
    return this.http.get<HotelDTO[]>(`${this.baseUrl}/HotelRooms/GetAllHotels`);
  }

  addOrUpdate(hotelRoom: HotelRoomDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/HotelRooms/AddOrUpdate`, hotelRoom);
  }

  delete(id: number): Observable<any> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete(`${this.baseUrl}/HotelRooms/Delete`, { params });
  }
}