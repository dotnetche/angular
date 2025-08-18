import { HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { lastValueFrom, Observable, of, Subject } from 'rxjs';
import { Router } from '@angular/router';

import { CommonUtils } from 'app/shared/utils/common.utils';
import { PermissionsService } from './permissions.service';
import { RequestService } from './request.service';
import { ISecurityService } from 'app/shared/interfaces/security-service.interface';
import { JwtToken } from 'app/shared/models/auth/jwt-token.model';
import { StorageService } from './local-storage.service';
import { User } from 'app/shared/models/auth/user.model';
import { DefaultUserPaths } from 'app/shared/enums/default-user-paths.enum';
import { LoginResult } from 'app/shared/models/auth/login-result.model';
import { RequestProperties } from 'app/shared/models/common/request-properties.model';
import { IRequestServiceParams } from 'app/shared/interfaces/request-service-params.interface';
import { LoginResultTypes } from 'app/shared/enums/login-result-types.enum';
import { StorageTypes } from 'app/shared/enums/storage-types.enum';
import { AuthCredentials } from 'app/shared/models/auth/auth-credentials.model';
import { UserRegistrationDTO } from 'app/core/auth/models/user-registration.model';

@Injectable({
    providedIn: 'root'
})
export class SecurityService implements ISecurityService {
    private static readonly TOKEN_NAME = 'token';

    private readonly controller: string = 'Security';
    private readonly requestService: RequestService;
    private readonly router: Router;
    private readonly permissionsService: PermissionsService;
    private _token?: JwtToken;
    private storage?: StorageService;

    private _isAuthenticatedEvent: EventEmitter<boolean>;
    private _user: User | undefined;

    public get isAuthenticatedEvent(): Observable<boolean> {
        return this._isAuthenticatedEvent;
    }

    public constructor (requestService: RequestService, permissionsService: PermissionsService, router: Router) {
        this.permissionsService = permissionsService;
        this.requestService = requestService;
        this.router = router;
        this._isAuthenticatedEvent = new EventEmitter<boolean>();

        this.requestService.errorEvent.subscribe(error => {
            if (error.status == HttpStatusCode.Unauthorized) {
                this.clearToken();
                this.router.navigate(['/account/sign-in']);
            }
        });
    }

    public async getUserRedirectPath(): Promise<string> {
        if (await this.isAuthenticated()) {
            return DefaultUserPaths.Authorized;
        } else {
            return DefaultUserPaths.Unauthorized;
        }
    }

    public registerUser(user: UserRegistrationDTO): Observable<number> {
        return this.requestService.post(this.controller, 'SignUp', undefined, user, {
            properties: new RequestProperties({
                rethrowException: true
            })
        });
    }

    public getUser(): Observable<User> {
        const subject: Subject<User> = new Subject();
        if (this._user == undefined) {
            this.requestService.get<User>(this.controller, 'GetUser', undefined, { responseTypeCtr: User }).subscribe(user => {
                if (user != undefined) {
                    const claims = [];

                    if (claims != undefined && claims.length > 0) {
                        this.permissionsService.loadPermissions(claims);
                    }
                } else {
                    this.permissionsService.loadPermissions([]);
                }

                this._user = user;
                subject.next(user);
                subject.complete();
            });
        } else {
            return of(this._user);
        }

        return subject;
    }

    public logout(): Observable<void> {
        const mutex: Subject<void> = new Subject();

        this.requestService.post(this.controller, 'Logout', 'Common').subscribe({
            next: () => {
                this.localLogout(mutex);
            },
            error: (error: HttpErrorResponse) => {
                this.localLogout(mutex);
            }
        });

        return mutex;
    }

    public clearToken(): Promise<boolean> {

        this._token = undefined;
        this._user = undefined;

        let persistToken = CommonUtils.toBoolean(this.storage!.get('persistToken') as string);

        if (persistToken) {
            return this.storage!.removeItem(SecurityService.TOKEN_NAME).then(result => {
                this._isAuthenticatedEvent.emit(false);
                return result;
            });
        } else {
            return this.storage!.removeItem(SecurityService.TOKEN_NAME).then(result => {
                this._isAuthenticatedEvent.emit(false);
                return result;
            });
        }
    }

    public get token(): string | undefined {
        if (this._token == undefined) {
            this._token = this.getTokenFromStorage();
        }

        if (this._token != undefined) {
            const now: Date = new Date();
            let tokenValidToDate: Date;

            if (this._token.validTo instanceof Date) {
                tokenValidToDate = this._token.validTo;
            }
            else {
                tokenValidToDate = new Date(this._token.validTo);
            }

            if (tokenValidToDate.getTime() > now.getTime()) {
                return this._token.token;
            } else {
                this.clearToken();
                return undefined;
            }
        } else {
            return undefined;
        }
    }

    public get impersonationToken(): string | undefined {
        return undefined;
    }

    public login(credentials: AuthCredentials): Promise<LoginResult | undefined> {
        var subject: Subject<LoginResult | undefined> = new Subject();
        let httpParams: HttpParams = new HttpParams();
        const requestProperties = RequestProperties.DEFAULT;
        requestProperties.rethrowException = true;
        requestProperties.showException = false;

        const requestParams = { httpParams: httpParams, properties: requestProperties, responseTypeCtr: JwtToken } as IRequestServiceParams;

        this.requestService.post<JwtToken, AuthCredentials>(this.controller, 'SignIn', undefined, credentials, requestParams).subscribe({
            next: (token) => {
                this._token = token;
                this.saveToken(credentials.rememberMe, token);

                this._isAuthenticatedEvent.emit(true);
                subject.next(new LoginResult(LoginResultTypes.Success));
                subject.complete();
            },
            error: (error: HttpErrorResponse) => {
                debugger;
                let result: LoginResult | undefined = new LoginResult(LoginResultTypes.Fail);
                if (error.status == 0 || error.status == HttpStatusCode.InternalServerError) {
                    result = undefined;
                } else if (error.status == HttpStatusCode.UnprocessableEntity) {
                    Object.assign(result, error.error);
                }

                this._isAuthenticatedEvent.emit(false);
                subject.next(result);
                subject.complete();
            }
        });

        return lastValueFrom(subject);
    }

    public isAuthenticated(): Promise<boolean> {
        if (this.token != undefined) {
            return Promise.resolve(true);
        } else {
            return Promise.resolve(false);
        }
    }

    public authorize(): void {
        //
    }

    private localLogout(mutex: Subject<void>) {
        this.clearToken();
        mutex.next();
        mutex.complete();
    }

    private saveToken(shouldPersist: boolean, token: JwtToken) {
        if (shouldPersist) {
            this.storage = StorageService.getStorage(StorageTypes.Local);

        } else {
            this.storage = StorageService.getStorage(StorageTypes.Session);
        }

        this.storage!.addOrUpdate(SecurityService.TOKEN_NAME, JSON.stringify(token));
    }

    private getTokenFromStorage(): JwtToken | undefined {
        let token: string | undefined = undefined;

        if (this.storage == undefined) {
            token = StorageService.getStorage(StorageTypes.Session).get(SecurityService.TOKEN_NAME) as string;

            if (token != undefined) {
                this.storage = StorageService.getStorage(StorageTypes.Session);
            } else {
                token = StorageService.getStorage(StorageTypes.Local).get(SecurityService.TOKEN_NAME) as string;

                if (token != undefined) {
                    this.storage = StorageService.getStorage(StorageTypes.Local);
                }
            }
        } else {
            token = this.storage.get(SecurityService.TOKEN_NAME) as string;
        }

        return this.buildJwtToken(token);
    }

    private buildJwtToken(token: string | undefined): JwtToken | undefined {
        if (token != undefined) {
            const tempToken = JSON.parse(token) as { token: string, tokenId: string, validTo: string; };

            let jwtToken = new JwtToken();
            jwtToken.token = tempToken.token;
            jwtToken.tokenId = tempToken.tokenId;
            jwtToken.validTo = new Date(tempToken.validTo);
            return jwtToken;
        }

        return undefined;
    }
}