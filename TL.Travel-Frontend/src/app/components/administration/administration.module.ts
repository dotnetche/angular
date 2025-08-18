import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainNavigationUtil } from 'app/core/navigation/main-navigation.util';
import { SharedModule } from 'app/shared/shared.module';
import { AdministrativeNavigation } from './administration.navigation';
import { RoomsComponent } from './rooms/rooms.component';
import { EditHotelComponent } from './hotels/edit-hotel/edit-hotel.component';
import { EditRoomComponent } from './rooms/components/edit-room/edit-room.component';
import { ClientsComponent } from './clients/clients.component';
import { EditClientComponent } from './clients/components/edit-client/edit-client.component';
import { EditPaymentTypesComponent } from './payment-types/edit-payment-types/edit-payment-types.component';
import { PaymentTypesComponent } from './payment-types/payment-types.component';
import { HotelsComponent } from './hotels/hotels.component';

@NgModule({
    declarations: [
        RoomsComponent,
        EditRoomComponent,
        ClientsComponent,
        EditClientComponent,
        PaymentTypesComponent,
        EditPaymentTypesComponent,
        HotelsComponent,
        EditHotelComponent

    ],
    imports: [
        RouterModule.forChild(MainNavigationUtil.getRoutes(AdministrativeNavigation)),
        SharedModule
    ],
    exports: [
        SharedModule
    ]
})
export class AdministrationModule {
}
