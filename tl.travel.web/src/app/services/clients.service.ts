import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientDTO, BaseGridRequestModel, GridResponse } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private readonly baseUrl = 'https://api.example.com'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getAll(request: BaseGridRequestModel): Observable<GridResponse<ClientDTO>> {
    return this.http.post<GridResponse<ClientDTO>>(`${this.baseUrl}/Clients/GetAll`, request);
  }

  getClient(id: number): Observable<ClientDTO> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<ClientDTO>(`${this.baseUrl}/Clients/GetClient`, { params });
  }

  addOrUpdate(client: ClientDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/Clients/AddOrUpdate`, client);
  }

  delete(id: number): Observable<any> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete(`${this.baseUrl}/Clients/Delete`, { params });
  }
}