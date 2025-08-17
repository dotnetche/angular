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
    path: '',
    loadComponent: () => import('./components/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'clients',
        loadComponent: () => import('./components/clients/clients.component').then(m => m.ClientsComponent)
      },
      {
        path: 'hotels',
        loadComponent: () => import('./components/hotels/hotels.component').then(m => m.HotelsComponent)
      },
      {
        path: 'hotel-rooms',
        loadComponent: () => import('./components/hotel-rooms/hotel-rooms.component').then(m => m.HotelRoomsComponent)
      },
      {
        path: 'feeding-types',
        loadComponent: () => import('./components/feeding-types/feeding-types.component').then(m => m.FeedingTypesComponent)
      },
      {
        path: 'tour-operators',
        loadComponent: () => import('./components/tour-operators/tour-operators.component').then(m => m.TourOperatorsComponent)
      },
      {
        path: 'payment-types',
        loadComponent: () => import('./components/payment-types/payment-types.component').then(m => m.PaymentTypesComponent)
      }
    ]
  }
];
