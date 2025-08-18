import { Pipe, PipeTransform } from '@angular/core';
import { NomenclatureDTO } from 'app/models/common/generic-nomenclature.model';

export type NomeclatureParameter = NomenclatureDTO<any>[] | undefined;

@Pipe({ name: 'nomenclatureItem' })
export class NomenclatureItemPipe implements PipeTransform {
    transform(value: any, ...args: NomeclatureParameter[]): NomenclatureDTO<any> | undefined {
        if (args != undefined && args.length == 1) {
            const collection = args[0] as NomenclatureDTO<any>[];
            if (collection != undefined) {
                const item = collection.find(x => x.value == value);
                return item;
            }
        }

        return undefined;
    }
}