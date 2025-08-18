import { LoginResultTypes } from 'app/shared/enums/login-result-types.enum';

export class LoginResult {
    public type!: LoginResultTypes;
    public lockedUntil?: Date;

    public constructor (type: LoginResultTypes) {
        this.type = type;
    }
}