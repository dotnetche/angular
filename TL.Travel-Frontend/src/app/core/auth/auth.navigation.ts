import { ITLNavigation } from "app/core/navigation/tl-navigation.interface";
import { AuthSignInComponent } from 'app/modules/auth/sign-in/sign-in.component';
import { AuthSignOutComponent } from 'app/modules/auth/sign-out/sign-out.component';
import { AuthSignUpComponent } from 'app/modules/auth/sign-up/sign-up.component';

export const AuthenticationRoutes: ITLNavigation[] = [
    {
        url: '',
        component: AuthSignInComponent,
        hideInMenu: true,
        isPublic: true
    },
    {
        id: 'sign-in',
        url: 'sign-in',
        component: AuthSignInComponent,
        hideInMenu: true,
        isPublic: true
    },
    {
        id: 'sign-up',
        url: 'sign-up',
        isPublic: true,
        hideInMenu: true,
        component: AuthSignUpComponent
    },
    {
        id: 'sign-out',
        url: 'sign-out',
        isPublic: true,
        hideInMenu: true,
        component: AuthSignOutComponent
    }
];

export const AuthenticationNavigation: ITLNavigation[] = AuthenticationRoutes;