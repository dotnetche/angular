export class UserRegistrationDTO {
    public email: string | undefined;
    public password: string | undefined;
    public name: string | undefined;
    public phone: string | undefined; 
    public address: string | undefined;

    public constructor(obj?: Partial<UserRegistrationDTO>) {
        Object.assign(this, obj);
    }
}