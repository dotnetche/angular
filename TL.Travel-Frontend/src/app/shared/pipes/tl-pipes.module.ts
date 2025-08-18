import { NgModule } from '@angular/core';
import { NomenclatureDisplayPipe } from './nomenclature-display.pipe';
import { NomenclatureItemPipe } from './nomenclature-item.pipe';
import { TLDateDifferencePipe } from './tl-date-difference.pipe';
import { TLTranslatePipe } from './tl-translate.pipe';


@NgModule({
    declarations: [
        TLTranslatePipe,
        NomenclatureDisplayPipe,
        NomenclatureItemPipe,
        TLDateDifferencePipe
    ],
    imports: [],
    exports: [
        TLTranslatePipe,
        NomenclatureDisplayPipe,
        NomenclatureItemPipe,
        TLDateDifferencePipe
    ]
})
export class TLPipesModule {
}