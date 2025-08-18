export class GridResultModel<T> {
    public records: T[];
    public totalRecordsCount: number;
    
    public constructor() {
        this.records = new Array<T>();
        this.totalRecordsCount = 0;
    }
}