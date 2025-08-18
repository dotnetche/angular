// import { ITLNavigation } from "app/core/navigation/tl-navigation.interface";
import { ITLNavigation } from 'app/core/navigation/tl-navigation.interface';
import { DashBoardComponent } from './dashboard/dashboard.component';

export const HomeRoutes: ITLNavigation[] = [
    {
        id: 'dashboard',
        url: '',
        translate: 'navigation.dashboard',
        type: 'basic',
        component: DashBoardComponent,
        hideInMenu: true
    },
    {
        id: 'dashboard',
        url: '/dashboard',
        translate: 'navigation.dashboard',
        type: 'basic',
        icon: 'dashboard',
        component: DashBoardComponent
    }
];

export const HomePagesNavigation: ITLNavigation[] = HomeRoutes;