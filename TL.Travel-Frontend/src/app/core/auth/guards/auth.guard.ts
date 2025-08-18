import { inject, runInInjectionContext } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { SecurityService } from 'app/services/common/security.service';
import { ISecurityService } from 'app/shared/interfaces/security-service.interface';

export const AuthGuard: CanActivateFn | CanActivateChildFn = async (route, state) => {
    const security: ISecurityService = inject(SecurityService);
    const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
    const result: boolean = await authGuardCheck(redirectUrl, security);
    return result;
};

export const AuthCanLoad: CanMatchFn | CanActivateChildFn = async (route, state) => {
    const security: ISecurityService = inject(SecurityService);
    return await authGuardCheck('/', security);
};

export const authGuardCheck = async (redirectURL: string, security: ISecurityService): Promise<boolean> => {
    // Check the authentication status
    const authenticated = security.isAuthenticated();
    if (!authenticated) {
        const router: Router = inject(Router);
        // Redirect to the sign-in page
        router.navigate(['account', 'sign-in'], { queryParams: { redirectURL } });

        // Prevent the access
        return false;
    }

    // Allow the access
    return true;
};

