import { ITLNavigation } from 'app/core/navigation/tl-navigation.interface';

export const BookingRoutes: ITLNavigation[] = [
    {
        id: 'reservations',
        url: '',
        //component: /* add reservations component */,
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
                //component: /* add reservations component */,
                translate: 'navigation.reservations',
                type: 'basic',
                icon: 'library_books'
            },
            {
                id: 'process-reservation',
                url: '/process-reservation',
                //component: /* add process reservation component */,
                translate: 'navigation.process-reservation',
                type: 'basic',
                icon: 'library_add'
            }
        ]
    }
];

export const BookingsNavigation: ITLNavigation[] = BookingRoutes;