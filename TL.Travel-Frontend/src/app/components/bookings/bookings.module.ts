import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainNavigationUtil } from 'app/core/navigation/main-navigation.util';
import { SharedModule } from 'app/shared/shared.module';
import { BookingsNavigation } from './bookings.navigation';

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild(MainNavigationUtil.getRoutes(BookingsNavigation)),
        SharedModule
    ]
})
export class BookingsModule {
}
