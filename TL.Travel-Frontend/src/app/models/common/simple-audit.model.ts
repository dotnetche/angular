export class SimpleAuditDTO {
    public createdBy: string | undefined;
    public createdOn: Date | undefined;
    public updatedBy: string | undefined;
    public updatedOn: Date | undefined;

    public constructor(obj?: Partial<SimpleAuditDTO>) {
        Object.assign(this, obj);
    }
}