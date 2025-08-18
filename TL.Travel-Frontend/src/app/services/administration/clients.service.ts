import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientDTO } from 'app/models/administration/client.model';
import { BaseGridRequestModel } from 'app/models/common/base-grid-request.model';
import { NomenclatureDTO } from 'app/models/common/generic-nomenclature.model';
import { GridResultModel } from 'app/models/common/grid-result.model';
import { Observable } from 'rxjs';
import { RequestService } from '../common/request.service';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  private readonly http: RequestService;
  private readonly controller: string = 'Clients';

  public constructor(http: RequestService) {
    this.http = http;
  }
  public getAll(request: BaseGridRequestModel): Observable<GridResultModel<ClientDTO[]>> {
    return this.http.post(this.controller, 'GetAll', undefined, request, {
      responseTypeCtr: ClientDTO
    });
  }

  public get(id: number): Observable<ClientDTO> {
    const params: HttpParams = new HttpParams().append('id', id.toString());
    return this.http.get(this.controller, 'GetClient', undefined, {
      httpParams: params,
      responseTypeCtr: ClientDTO
    });
  }

  public add(model: ClientDTO): Observable<void> {
    return this.http.post(this.controller, 'AddOrUpdate', undefined, model, {
      successMessage: 'successfully-added-entry'
    });
  }

  public update(model: ClientDTO): Observable<void> {
    return this.http.post(this.controller, 'AddOrUpdate', undefined, model, {
      successMessage: 'successfully-updated-entry'
    });
  }

  public delete(id: number): Observable<void> {
    return this.http.deleteById(this.controller, 'Delete', id, undefined, 'successfully-deleted-entry');
  }
}