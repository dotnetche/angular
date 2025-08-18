import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainNavigationUtil } from 'app/core/navigation/main-navigation.util';
import { SharedModule } from 'app/shared/shared.module';
import { BookingsNavigation } from './bookings.navigation';
import { ReservationsComponent } from './reservations/reservations.component';
import { EditReservationComponent } from './reservations/components/edit-reservation/edit-reservation.component';
import { ProcessReservationComponent } from './process-reservation/process-reservation.component';
import { EditRoomDialogComponent } from './process-reservation/components/edit-room-dialog/edit-room-dialog.component';
import { EditPaymentDialogComponent } from './process-reservation/components/edit-payment-dialog/edit-payment-dialog.component';

@NgModule({
    declarations: [
        ReservationsComponent,
        EditReservationComponent,
        ProcessReservationComponent,
        EditRoomDialogComponent,
        EditPaymentDialogComponent
    ],
    imports: [
        RouterModule.forChild(MainNavigationUtil.getRoutes(BookingsNavigation)),
        SharedModule
    ]
})
export class BookingsModule {
}
