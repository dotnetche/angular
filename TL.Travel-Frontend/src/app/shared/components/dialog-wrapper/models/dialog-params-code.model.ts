export class DialogParamsCodeModel {

    public constructor(obj?: Partial<DialogParamsCodeModel>) {
        Object.assign(this, obj);
    }

    public code!: string;
    public isReadonly!: boolean;
}