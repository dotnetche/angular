import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HotelDTO } from 'app/models/administration/hotel.model';
import { BaseGridRequestModel } from 'app/models/common/base-grid-request.model';
import { NomenclatureDTO } from 'app/models/common/generic-nomenclature.model';
import { GridResultModel } from 'app/models/common/grid-result.model';
import { Observable } from 'rxjs';
import { RequestService } from '../common/request.service';
@Injectable({
  providedIn: 'root'
})
export class HotelsService {

  private readonly http: RequestService;
  private readonly controller: string = 'Hotels';

  public constructor(http: RequestService) {
    this.http = http;
  }

  getAll(request: BaseGridRequestModel): Observable<GridResultModel<HotelDTO>> {
    return this.http.post(this.controller, 'GetAll', undefined, request, {
      responseTypeCtr: HotelDTO
    });
  }

  get(id: number): Observable<HotelDTO> {
    const params: HttpParams = new HttpParams().append('id', id.toString());
    return this.http.get(this.controller, 'Get', undefined, {
      httpParams: params,
      responseTypeCtr: HotelDTO
    });
  }


  getAllLocations(): Observable<NomenclatureDTO<number>[]> {
    return this.http.get(this.controller, 'GetAllLocations', undefined, {
      responseTypeCtr: NomenclatureDTO
    });
  }

  getAllOperators(): Observable<NomenclatureDTO<number>[]> {
    return this.http.get(this.controller, 'GetAllOperators', undefined, {
      responseTypeCtr: NomenclatureDTO
    });
  }

  getAllAgents(): Observable<NomenclatureDTO<number>[]> {
    return this.http.get(this.controller, 'GetAllAgents', undefined, {
      responseTypeCtr: NomenclatureDTO
    });
  }

  public add(model: HotelDTO): Observable<void> {
    return this.http.post(this.controller, 'AddOrUpdate', undefined, model, {
      successMessage: 'successfully-added-entry'
    });
  }

  public update(model: HotelDTO): Observable<void> {
    return this.http.post(this.controller, 'AddOrUpdate', undefined, model, {
      successMessage: 'successfully-updated-entry'
    });
  }

  public delete(id: number): Observable<void> {
    return this.http.deleteById(this.controller, 'Delete', id, undefined, 'successfully-deleted-entry');
  }
}