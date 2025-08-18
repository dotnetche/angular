import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormControl,
    FormGroup,
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { UserRegistrationDTO } from 'app/core/auth/models/user-registration.model';
import { SecurityService } from 'app/services/common/security.service';
import { TLValidators } from 'app/shared/utils/tl-validators.util';

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AuthSignUpComponent {
    public form: FormGroup;

    private securityService: SecurityService;
    private router: Router;

    public constructor(securityService: SecurityService, router: Router) {
        this.securityService = securityService;
        this.router = router;

        this.buildForm();
    }

    public signUp(): void {
        this.form.markAllAsTouched();

        if (this.form.valid) {
            const model: UserRegistrationDTO = this.fillModel();
            this.securityService.registerUser(model).subscribe({
                next: () => {
                    this.router.navigate(['/account/sign-in']);
                }
            });
        }
    }

    private buildForm(): void {
        this.form = new FormGroup({
            nameControl: new FormControl('', [Validators.required, Validators.maxLength(200)]),
            emailControl: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(200)]),
            passwordControl: new FormControl('', [Validators.required, Validators.maxLength(100)]),
            passwordConfirmationControl: new FormControl('', [
                Validators.required, Validators.maxLength(100),  
                TLValidators.confirmPasswordValidator('passwordControl', 'passwordConfirmationControl')
            ]),
            phoneControl: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            addressControl: new FormControl('', [Validators.required, Validators.maxLength(500)])
        });

        this.form.get('passwordControl')!.valueChanges.subscribe({
            next: () => {
                this.form.get('passwordConfirmationControl')!.updateValueAndValidity({ emitEvent: false });
            }
        });
    }

    private fillModel(): UserRegistrationDTO {
        const model: UserRegistrationDTO = new UserRegistrationDTO({
            name: this.form.get('nameControl')!.value,
            email: this.form.get('emailControl')!.value,
            password: this.form.get('passwordControl')!.value,
            phone: this.form.get('phoneControl')!.value,
            address: this.form.get('addressControl')!.value
        });

        return model;
    }
}