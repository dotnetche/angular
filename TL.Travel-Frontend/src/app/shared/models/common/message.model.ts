export class Message {
    public text: string | undefined;

    public constructor(obj?: Partial<Message>) {
        Object.assign(this, obj);
    }
}