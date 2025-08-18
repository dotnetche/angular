import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { SecurityService } from 'app/services/common/security.service';
import { ISecurityService } from 'app/shared/interfaces/security-service.interface';
import { environment } from 'environments/environment';
import { Observable, catchError, throwError } from 'rxjs';

/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const authInterceptor = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const security: ISecurityService = inject(SecurityService);
    let requestToForward = req;
    const token = getToken(security);

    const headers = getHeaders(security, token, environment.production);

    if (headers != undefined) {
        requestToForward = req.clone({ withCredentials: token != undefined, setHeaders: headers });
    } else {
        requestToForward = req;
    }

    return next(requestToForward).pipe(catchError(error => { return errorHandler(security, error); }));
};


export const getHeaders = (security: ISecurityService, token: string | undefined, isProduction: boolean): any => {
    let headers: any = undefined;

    if (!isProduction) {
        if (headers == undefined) {
            headers = {};
        }

        headers['Access-Control-Allow-Origin'] = '*';
    }

    if (token != undefined && token != '') {

        if (headers == undefined) {
            headers = {};
        }

        headers['Authorization'] = `Bearer ${token}`;
    }

    let impersonationToken = security.impersonationToken;
    if (impersonationToken != undefined) {

        if (headers == undefined) {
            headers = {};
        }

        headers['Impersonate'] = impersonationToken;
    }

    return headers;
};

export const getToken = (security: ISecurityService): string | undefined => {
    let token: string | undefined;
    if (security !== undefined) {
        token = security.token;
    }

    return token;
};

export const errorHandler = (security: ISecurityService, error: HttpErrorResponse): Observable<any> => {
    if (error.status === 401) {
        if (security != null && security != undefined) {
            security.authorize();
        }
    }

    return throwError(() => error);
};