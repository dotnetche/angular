import { HttpHeaders, HttpParams } from '@angular/common/http';
import { RequestProperties } from '../models/common/request-properties.model';

export interface IRequestServiceParams {
    successMessage?: string;
    httpParams?: HttpParams;
    properties?: RequestProperties;
    responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
    responseTypeCtr?: new (...args: any[]) => any;
    gridResponseTypeCtr?: new (...args: any[]) => any;
    headers?: HttpHeaders;
}