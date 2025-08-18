import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentTypeDTO } from 'app/models/administration/payment-type.model';
import { BaseGridRequestModel } from 'app/models/common/base-grid-request.model';
import { Observable } from 'rxjs';
import { RequestService } from '../common/request.service';
import { GridResultModel } from 'app/models/common/grid-result.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentTypesService {

private readonly http: RequestService;
  private readonly controller: string = 'PaymentTypes';

  public constructor(http: RequestService) {
    this.http = http;
  }
  public getAll(request: BaseGridRequestModel): Observable<GridResultModel<PaymentTypeDTO[]>> {
    return this.http.post(this.controller, 'GetAll', undefined, request, {
      responseTypeCtr: PaymentTypeDTO
    });
  }

  public get(id: number): Observable<PaymentTypeDTO> {
    const params: HttpParams = new HttpParams().append('id', id.toString());
    return this.http.get(this.controller, 'Get', undefined, {
      httpParams: params,
      responseTypeCtr: PaymentTypeDTO
    });
  }

  public add(model: PaymentTypeDTO): Observable<void> {
    return this.http.post(this.controller, 'AddOrUpdate', undefined, model, {
      successMessage: 'successfully-added-entry'
    });
  }

  public update(model: PaymentTypeDTO): Observable<void> {
    return this.http.post(this.controller, 'AddOrUpdate', undefined, model, {
      successMessage: 'successfully-updated-entry'
    });
  }

  public delete(id: number): Observable<void> {
    return this.http.deleteById(this.controller, 'Delete', id, undefined, 'successfully-deleted-entry');
  }
}