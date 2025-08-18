import { AfterViewInit, Component, ContentChild, forwardRef, Input, TemplateRef } from '@angular/core';
import { ITranslateService } from 'app/shared/interfaces/translate-service.interface';
import { BaseDataColumn } from '../base-data-column';
import { TranslateService } from 'app/core/translation/translate.service';

@Component({
    selector: 'data-template-column',
    templateUrl: './data-column-template.component.html',
    providers: [{ provide: BaseDataColumn, useExisting: forwardRef(() => TLDataColumnTemplateComponent) }]
})
export class TLDataColumnTemplateComponent extends BaseDataColumn implements AfterViewInit {
    @Input()
    public cellClass: string = '';

    @Input()
    public headerClass: string = '';

    @ContentChild(TemplateRef)
    public ngContentTest: any;

    public cellTemplate!: TemplateRef<any>;
    public headerTemplate!: TemplateRef<any>;
    public tlTranslate: ITranslateService;

    public get cellClassList(): string {
        return 'justify-center overflow-hidden ' + this.cellClass;
    }

    constructor(tlTranslateService: TranslateService) {
        super();
        this.tlTranslate = tlTranslateService;
    }

    public ngAfterViewInit(): void {
        setTimeout(() => {
            this.cellTemplate = this.ngContentTest;
        });
    }

}