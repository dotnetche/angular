import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'clients',
    loadComponent: () => import('./components/clients/clients.component').then(m => m.ClientsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'hotels',
    loadComponent: () => import('./components/hotels/hotels.component').then(m => m.HotelsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'hotel-rooms',
    loadComponent: () => import('./components/hotel-rooms/hotel-rooms.component').then(m => m.HotelRoomsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'feeding-types',
    loadComponent: () => import('./components/feeding-types/feeding-types.component').then(m => m.FeedingTypesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'tour-operators',
    loadComponent: () => import('./components/tour-operators/tour-operators.component').then(m => m.TourOperatorsComponent),
    canActivate: [AuthGuard]
  }
];
