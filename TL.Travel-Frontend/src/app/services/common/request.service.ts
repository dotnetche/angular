import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TLSnackbar } from 'app/shared/components/snackbar/tl.snackbar';
import { SpinnerService } from 'app/shared/components/tl-spinner/spinner.service';
import { ITranslateService } from 'app/shared/interfaces/translate-service.interface';
import { Observable } from 'rxjs';
import { BaseRequestService } from './base-request.service';

@Injectable({
    providedIn: 'root'
})
export class RequestService extends BaseRequestService {
    public constructor (
        http: HttpClient,
        snackbar: TLSnackbar,
        @Inject('ITranslateService') translationService: ITranslateService,
        spinner: SpinnerService
    ) {
        super(http, snackbar, translationService, spinner);
    }

    public deleteById<TResult>(controller: string, service: string, id: number | string, baseRoute?: string, successMessage?: string): Observable<TResult> {
        let params = new HttpParams();
        params = params.set('id', id.toString());

        return this.delete<TResult>(controller, service, baseRoute, { httpParams: params, successMessage: successMessage });
    }

    public getById<TResult>(controller: string, service: string, id: number | string, baseRoute?: string, responseTypeCtr?: new (...args: any[]) => any): Observable<TResult> {
        let params = new HttpParams();
        params = params.set('id', id.toString());

        return this.get(controller, service, baseRoute, { httpParams: params, responseTypeCtr: responseTypeCtr });
    }
}