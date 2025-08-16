import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HotelRoomDTO, HotelDTO, BaseGridRequestModel, GridResponse } from '../models/hotel-room.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class HotelRoomsService {

  constructor(private apiService: ApiService) {}

  getAll(request: BaseGridRequestModel): Observable<GridResponse<HotelRoomDTO>> {
    return this.apiService.post<GridResponse<HotelRoomDTO>>('/HotelRooms/GetAll', request);
  }

  getHotelRoom(id: number): Observable<HotelRoomDTO> {
    const params = new HttpParams().set('id', id.toString());
    return this.apiService.get<HotelRoomDTO>('/HotelRooms/Get', params);
  }

  getAllHotels(): Observable<HotelDTO[]> {
    return this.apiService.get<HotelDTO[]>('/HotelRooms/GetAllHotels');
  }

  addOrUpdate(hotelRoom: HotelRoomDTO): Observable<any> {
    return this.apiService.post('/HotelRooms/AddOrUpdate', hotelRoom);
  }

  delete(id: number): Observable<any> {
    const params = new HttpParams().set('id', id.toString());
    return this.apiService.delete('/HotelRooms/Delete', params);
  }
}