import { NgModule } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthSignInComponent } from 'app/modules/auth/sign-in/sign-in.component';
import { AuthSignOutComponent } from 'app/modules/auth/sign-out/sign-out.component';
import { AuthSignUpComponent } from 'app/modules/auth/sign-up/sign-up.component';
import { SharedModule } from 'app/shared/shared.module';
import { MainNavigationUtil } from '../navigation/main-navigation.util';
import { AuthenticationNavigation } from './auth.navigation';
import { FuseAlertComponent } from '@fuse/components/alert';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
    declarations: [
        AuthSignUpComponent,
        AuthSignInComponent,
        AuthSignOutComponent
    ],
    imports: [
        SharedModule,
        RouterLink,
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        RouterModule.forChild(MainNavigationUtil.getRoutes(AuthenticationNavigation))
    ],
    exports: [
        AuthSignUpComponent,
        AuthSignInComponent,
        AuthSignOutComponent
    ]
})
export class AuthModule {
}
