import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentTypeDTO, BaseGridRequestModel, GridResponse } from '../models/payment-type.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentTypesService {

  constructor(private apiService: ApiService) {}

  getAll(request: BaseGridRequestModel): Observable<GridResponse<PaymentTypeDTO>> {
    return this.apiService.post<GridResponse<PaymentTypeDTO>>('/PaymentTypes/GetAll', request);
  }

  getPaymentType(id: number): Observable<PaymentTypeDTO> {
    const params = new HttpParams().set('id', id.toString());
    return this.apiService.get<PaymentTypeDTO>('/PaymentTypes/Get', params);
  }

  addOrUpdate(paymentType: PaymentTypeDTO): Observable<any> {
    return this.apiService.post('/PaymentTypes/AddOrUpdate', paymentType);
  }

  delete(id: number): Observable<any> {
    const params = new HttpParams().set('id', id.toString());
    return this.apiService.delete('/PaymentTypes/Delete', params);
  }
}