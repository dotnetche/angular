import { Component, ViewEncapsulation } from '@angular/core';
import {
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { SecurityService } from 'app/services/common/security.service';
import { LoginResultTypes } from 'app/shared/enums/login-result-types.enum';
import { AuthCredentials } from 'app/shared/models/auth/auth-credentials.model';
import { LoginResult } from 'app/shared/models/auth/login-result.model';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AuthSignInComponent {
    public form: FormGroup;

    private activatedRoute: ActivatedRoute;
    private securityService: SecurityService;
    private router: Router;

    public constructor(activatedRoute: ActivatedRoute, securityService: SecurityService, router: Router) {
        this.activatedRoute = activatedRoute;
        this.securityService = securityService;
        this.router = router;

        this.buildForm();
    }

    public async signIn(): Promise<void> {
        this.form.markAllAsTouched();

        if (this.form.valid) {
            const credentials: AuthCredentials = this.fillModel();
            const result: LoginResult = await this.securityService.login(credentials);

            if (result.type === LoginResultTypes.Success) {
                const redirectURL = this.activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/home/dashboard';
                this.router.navigateByUrl(redirectURL);
            }
        }
    }

    private buildForm(): void {
        this.form = new FormGroup({
            usernameControl: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(200)]),
            passwordControl: new FormControl('', Validators.required)
        });
    }

    private fillModel(): AuthCredentials {
        const model: AuthCredentials = new AuthCredentials({
            password: this.form.get('passwordControl')!.value,
            userName: this.form.get('usernameControl')!.value
        });

        return model;
    }
}
