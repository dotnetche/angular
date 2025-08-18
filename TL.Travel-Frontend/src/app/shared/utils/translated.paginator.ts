import { MatPaginatorIntl } from '@angular/material/paginator';
import { Inject, Injectable } from '@angular/core';
import { ITranslateService } from '../interfaces/translate-service.interface';

@Injectable()
export class TranslatedMatPaginatorIntl extends MatPaginatorIntl {
    public itemsPerPageLabel: string;
    public nextPageLabel: string;
    public previousPageLabel: string;
    public getRangeLabel: (page: number, pageSize: number, length: number) => string;

    private bularianRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
            return `0 ${this.translationService.getValue('common.paginator-from')} ${length}`;
        }

        length = Math.max(length, 0);

        const startIndex = page * pageSize;

        const endIndex = startIndex < length ?
            Math.min(startIndex + pageSize, length) :
            startIndex + pageSize;

        return `${startIndex + 1} - ${endIndex} от ${length}`;
    }

    private translationService: ITranslateService;

    constructor(@Inject('ITranslateService') translationService: ITranslateService) {
        super();
        this.translationService = translationService;
        this.getRangeLabel = this.bularianRangeLabel;
        this.itemsPerPageLabel = this.translationService.getValue('common.items-per-page');
        this.nextPageLabel = this.translationService.getValue('common.next-page');
        this.previousPageLabel = this.translationService.getValue('common.previous-page');
    }
}
