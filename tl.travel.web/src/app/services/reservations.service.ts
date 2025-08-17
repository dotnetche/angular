import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  EditReservationDTO, 
  ReservationDTO,
  OperatorDTO,
  HotelDTO,
  ReservationStatusDTO,
  HotelRoomDTO,
  FeedingTypeDTO,
  PaymentTypeDTO,
  PaymentChannelDTO,
  ClientDTO,
  BaseGridRequestModel, 
  GridResponse 
} from '../models/reservation.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  constructor(private apiService: ApiService) {}

  getAll(request: BaseGridRequestModel): Observable<GridResponse<ReservationDTO>> {
    return this.apiService.post<GridResponse<ReservationDTO>>('/Reservations/GetAll', request);
  }

  getReservation(id: number): Observable<EditReservationDTO> {
    const params = new HttpParams().set('id', id.toString());
    return this.apiService.get<EditReservationDTO>('/Reservations/GetReservation', params);
  }

  getAllOperators(): Observable<OperatorDTO[]> {
    return this.apiService.get<OperatorDTO[]>('/Reservations/GetAllOperators');
  }

  getAllHotels(): Observable<HotelDTO[]> {
    return this.apiService.get<HotelDTO[]>('/Reservations/GetAllHotels');
  }

  getAllReservationStatuses(): Observable<ReservationStatusDTO[]> {
    return this.apiService.get<ReservationStatusDTO[]>('/Reservations/GetAllReservationStatuses');
  }

  getAllHotelRooms(hotelId?: number): Observable<HotelRoomDTO[]> {
    let params = new HttpParams();
    if (hotelId) {
      params = params.set('hotelId', hotelId.toString());
    }
    return this.apiService.get<HotelRoomDTO[]>('/Reservations/GetAllHotelRooms', params);
  }

  getAllFeedingTypes(): Observable<FeedingTypeDTO[]> {
    return this.apiService.get<FeedingTypeDTO[]>('/Reservations/GetAllFeedingTypes');
  }

  getAllPaymentTypes(): Observable<PaymentTypeDTO[]> {
    return this.apiService.get<PaymentTypeDTO[]>('/Reservations/GetAllPaymentTypes');
  }

  getAllPaymentChannels(): Observable<PaymentChannelDTO[]> {
    return this.apiService.get<PaymentChannelDTO[]>('/Reservations/GetAllPaymentChannels');
  }

  getAllClients(): Observable<ClientDTO[]> {
    return this.apiService.get<ClientDTO[]>('/Reservations/GetAllClients');
  }

  addOrUpdate(reservation: EditReservationDTO): Observable<any> {
    return this.apiService.post('/Reservations/AddOrUpdate', reservation);
  }

  delete(id: number): Observable<any> {
    const params = new HttpParams().set('id', id.toString());
    return this.apiService.delete('/Reservations/Delete', params);
  }
}