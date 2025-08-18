export class NomenclatureDTO<T> {
    public value?: T;
    public code?: string;
    public displayName?: string;
    public description?: string;
    public isActive?: boolean;
    
    public constructor(obj?: Partial<NomenclatureDTO<T>>) {
        Object.assign(this, obj);
    }
} 