export class User {
    public id!: string;
    public username!: string;
    public email?: string;
    public avatar?: string;
    public personName?: string;
    public isInternalUser!: boolean;
    public userMustChangePassword?: boolean;
    public railwayUndertakingId?: number;
    public organizationUnitId?: number;
}
