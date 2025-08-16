import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/clients',
    pathMatch: 'full'
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
  }
];
