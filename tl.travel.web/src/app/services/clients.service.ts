import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientDTO, BaseGridRequestModel, GridResponse } from '../models/client.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(private apiService: ApiService) {}

  getAll(request: BaseGridRequestModel): Observable<GridResponse<ClientDTO>> {
    return this.apiService.post<GridResponse<ClientDTO>>('/Clients/GetAll', request);
  }

  getClient(id: number): Observable<ClientDTO> {
    const params = new HttpParams().set('id', id.toString());
    return this.apiService.get<ClientDTO>('/Clients/GetClient', params);
  }

  addOrUpdate(client: ClientDTO): Observable<any> {
    return this.apiService.post('/Clients/AddOrUpdate', client);
  }

  delete(id: number): Observable<any> {
    const params = new HttpParams().set('id', id.toString());
    return this.apiService.delete('/Clients/Delete', params);
  }
}