export class JwtToken {
    public tokenId!: string;
    public token!: string;
    public validTo!: Date;

    public constructor(obj?: Partial<JwtToken>) {
        if (obj != undefined) {
            Object.assign(this, obj);
        }
    }
}