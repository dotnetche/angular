import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { RedirectComponent } from './layout/common/redirect/redirect.component';

export const appRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        component: RedirectComponent
    },
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'futuristic'
        },
        children: [
            { path: 'home', loadChildren: () => import('app/components/home/home.module').then(m => m.HomeModule) },
            { path: 'administration', loadChildren: () => import('app/components/administration/administration.module').then(m => m.AdministrationModule) },
            { path: 'booking', loadChildren: () => import('app/components/bookings/bookings.module').then(m => m.BookingsModule) }
        ]
    },
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'account', loadChildren: () => import('app/core/auth/auth.module').then(m => m.AuthModule) }
        ]
    }
];
