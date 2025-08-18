import { ITLNavigation } from "app/core/navigation/tl-navigation.interface";
import { RoomsComponent } from './rooms/rooms.component';
import { ClientsComponent } from "./clients/clients.component";
import { PaymentTypesComponent } from "./payment-types/payment-types.component";
import { HotelsComponent } from "./hotels/hotels.component";

export const AdministrativeRoutes: ITLNavigation[] = [
    {
        id: 'hotels',
        url: '',
        hideInMenu: true,
        //component: /* add hotels component here*/,
    },
    {
        id: 'administration',
        translate: 'navigation.administration',
        type: 'group',
        children: [
            {
                id: 'hotels',
                url: '/hotels',
                translate: 'navigation.hotels',
                type: 'basic',
                icon: 'hotel',
                component: HotelsComponent,
            },
            {
                id: 'clients',
                url: '/clients',
                translate: 'navigation.clients',
                type: 'basic',
                icon: 'person',
                component: ClientsComponent,
            },
            {
                id: 'rooms',
                url: '/rooms',
                translate: 'navigation.rooms',
                type: 'basic',
                icon: 'room_service',
                component: RoomsComponent
            },
            {
                id: 'tour-operators',
                url: '/tour-operators',
                translate: 'navigation.tour-operators',
                type: 'basic',
                icon: 'supervisor_account',
                //component: /* add tour operators component here*/,
            },
            {
                id: 'meals',
                url: '/meals',
                translate: 'navigation.meals',
                type: 'basic',
                icon: 'restaurant_menu',
                //component: /* add meals component here*/,
            },
            {
                id: 'payment-types',
                url: '/payment-types',
                translate: 'navigation.payment-types',
                type: 'basic',
                icon: 'payment',
                component: PaymentTypesComponent,
            }
        ]
    }
];

export const AdministrativeNavigation: ITLNavigation[] = AdministrativeRoutes;