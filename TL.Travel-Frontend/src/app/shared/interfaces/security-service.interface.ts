import { Observable } from 'rxjs';

import { AuthCredentials } from '../models/auth/auth-credentials.model';
import { LoginResult } from '../models/auth/login-result.model';
import { User } from '../models/auth/user.model';

export interface ISecurityService {
    isAuthenticatedEvent: Observable<boolean>;
    token: string | undefined;
    impersonationToken: string | undefined;
    authorize(): void;
    isAuthenticated(): Promise<boolean>;
    login(credentials: AuthCredentials): Promise<LoginResult | undefined>;
    getUser(): Observable<User>;
    logout(): Observable<void>;
    clearToken(): Promise<boolean>;
    getUserRedirectPath(): Promise<string>;
}
