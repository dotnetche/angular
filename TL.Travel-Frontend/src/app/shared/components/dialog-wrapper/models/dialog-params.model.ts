export class DialogParamsModel {
    public constructor(id: any, isReadonly: boolean) {
        this.id = id;
        this.isReadonly = isReadonly;
    }

    public id: any;
    public isReadonly: boolean;
}