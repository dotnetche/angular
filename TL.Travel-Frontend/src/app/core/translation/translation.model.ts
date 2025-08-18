import { Locale } from 'app/shared/interfaces/translate-service.interface';

export class Translation implements Locale {
    constructor(public lang: string, public data: any, public shouldMerge: boolean = false) { }
}