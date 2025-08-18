import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HotelRoomDTO } from 'app/models/administration/hotel-room.model';
import { BaseGridRequestModel } from 'app/models/common/base-grid-request.model';
import { NomenclatureDTO } from 'app/models/common/generic-nomenclature.model';
import { GridResultModel } from 'app/models/common/grid-result.model';
import { Observable } from 'rxjs';
import { RequestService } from '../common/request.service';

@Injectable({
    providedIn: 'root'
})
export class HotelRoomsService {
    private readonly http: RequestService;
    private readonly controller: string = 'HotelRooms';

    public constructor(http: RequestService) {
        this.http = http;
    }

    public getAll(request: BaseGridRequestModel): Observable<GridResultModel<HotelRoomDTO[]>> {
        return this.http.post(this.controller, 'GetAll', undefined, request, {
            responseTypeCtr: HotelRoomDTO
        });
    }

    public get(id: number): Observable<HotelRoomDTO> {
        const params: HttpParams = new HttpParams().append('id', id.toString());
        return this.http.get(this.controller, 'Get', undefined, {
            httpParams: params,
            responseTypeCtr: HotelRoomDTO
        });
    }

    public getHotels(): Observable<NomenclatureDTO<number>[]> {
        return this.http.get(this.controller, 'GetAllHotels', undefined, {
            responseTypeCtr: NomenclatureDTO
        });
    }

    public add(model: HotelRoomDTO): Observable<void> {
        return this.http.post(this.controller, 'AddOrUpdate', undefined, model, {
            successMessage: 'successfully-added-entry'
        });
    }

    public update(model: HotelRoomDTO): Observable<void> {
        return this.http.post(this.controller, 'AddOrUpdate', undefined, model, {
            successMessage: 'successfully-updated-entry'
        });
    }

    public delete(id: number): Observable<void> {
        return this.http.deleteById(this.controller, 'Delete', id, undefined, 'successfully-deleted-entry');
    }
}