import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { DashBoardComponent } from './dashboard/dashboard.component';
import { HomePagesNavigation } from './home.navigation';
import { MainNavigationUtil } from 'app/core/navigation/main-navigation.util';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
    declarations: [
        DashBoardComponent,
    ],
    imports: [
        RouterModule.forChild(MainNavigationUtil.getRoutes(HomePagesNavigation)),
        SharedModule,
        NgxChartsModule,
    ]
})
export class HomeModule {
}   
