import { ITLNavigation } from 'app/core/navigation/tl-navigation.interface';
import { ReservationsComponent } from './reservations/reservations.component';
import { ProcessReservationComponent } from './process-reservation/process-reservation.component';

export const BookingRoutes: ITLNavigation[] = [
    {
        id: 'reservations',
        url: '',
        component: ReservationsComponent,
        hideInMenu: true
    },
    {
        id: 'bookings',
        translate: 'navigation.bookings',
        type: 'group',
        children: [
            {
                id: 'reservations',
                url: '/reservations',
                component: ReservationsComponent,
                translate: 'navigation.reservations',
                type: 'basic',
                icon: 'library_books'
            },
            {
                id: 'process-reservation',
                url: '/process-reservation',
                component: ProcessReservationComponent,
                translate: 'navigation.process-reservation',
                type: 'basic',
                icon: 'library_add'
            }
        ]
    }
];

export const BookingsNavigation: ITLNavigation[] = BookingRoutes;