import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EditReservationDTO, ReservationDTO, OperatorDTO, HotelDTO, ReservationStatusDTO, HotelRoomDTO, FeedingTypeDTO, PaymentTypeDTO, PaymentChannelDTO, ClientDTO } from 'app/models/administration/reservation.model';
import { BaseGridRequestModel } from 'app/models/common/base-grid-request.model';
import { NomenclatureDTO } from 'app/models/common/generic-nomenclature.model';
import { GridResultModel } from 'app/models/common/grid-result.model';
import { Observable } from 'rxjs';
import { RequestService } from '../common/request.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  private readonly http: RequestService;
  private readonly controller: string = 'Reservations';

  public constructor(http: RequestService) {
    this.http = http;
  }

  public getAll(request: BaseGridRequestModel): Observable<GridResultModel<ReservationDTO[]>> {
    return this.http.post(this.controller, 'GetAll', undefined, request, {
      responseTypeCtr: ReservationDTO
    });
  }

  public get(id: number): Observable<EditReservationDTO> {
    const params: HttpParams = new HttpParams().append('id', id.toString());
    return this.http.get(this.controller, 'GetReservation', undefined, {
      httpParams: params,
      responseTypeCtr: EditReservationDTO
    });
  }

  public getAllOperators(): Observable<NomenclatureDTO<number>[]> {
    return this.http.get(this.controller, 'GetAllOperators', undefined, {
      responseTypeCtr: NomenclatureDTO
    });
  }

  public getAllHotels(): Observable<NomenclatureDTO<number>[]> {
    return this.http.get(this.controller, 'GetAllHotels', undefined, {
      responseTypeCtr: NomenclatureDTO
    });
  }

  public getAllReservationStatuses(): Observable<NomenclatureDTO<number>[]> {
    return this.http.get(this.controller, 'GetAllReservationStatuses', undefined, {
      responseTypeCtr: NomenclatureDTO
    });
  }

  public getAllHotelRooms(hotelId?: number): Observable<NomenclatureDTO<number>[]> {
    let params = new HttpParams();
    if (hotelId) {
      params = params.append('hotelId', hotelId.toString());
    }
    return this.http.get(this.controller, 'GetAllHotelRooms', undefined, {
      httpParams: params,
      responseTypeCtr: NomenclatureDTO
    });
  }

  public getAllFeedingTypes(): Observable<NomenclatureDTO<number>[]> {
    return this.http.get(this.controller, 'GetAllFeedingTypes', undefined, {
      responseTypeCtr: NomenclatureDTO
    });
  }

  public getAllPaymentTypes(): Observable<NomenclatureDTO<number>[]> {
    return this.http.get(this.controller, 'GetAllPaymentTypes', undefined, {
      responseTypeCtr: NomenclatureDTO
    });
  }

  public getAllPaymentChannels(): Observable<NomenclatureDTO<number>[]> {
    return this.http.get(this.controller, 'GetAllPaymentChannels', undefined, {
      responseTypeCtr: NomenclatureDTO
    });
  }

  public getAllClients(): Observable<NomenclatureDTO<number>[]> {
    return this.http.get(this.controller, 'GetAllClients', undefined, {
      responseTypeCtr: NomenclatureDTO
    });
  }

  public add(model: EditReservationDTO): Observable<void> {
    return this.http.post(this.controller, 'AddOrUpdate', undefined, model, {
      successMessage: 'successfully-added-entry'
    });
  }

  public update(model: EditReservationDTO): Observable<void> {
    return this.http.post(this.controller, 'AddOrUpdate', undefined, model, {
      successMessage: 'successfully-updated-entry'
    });
  }

  public delete(id: number): Observable<void> {
    return this.http.deleteById(this.controller, 'Delete', id, undefined, 'successfully-deleted-entry');
  }
}