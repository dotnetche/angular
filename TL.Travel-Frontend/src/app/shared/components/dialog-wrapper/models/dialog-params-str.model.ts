export class DialogParamsStrModel {

    public constructor(id: string, isReadonly: boolean) {
        this.id = id;
        this.isReadonly = isReadonly;
    }

    public id: string;
    public isReadonly: boolean;
}