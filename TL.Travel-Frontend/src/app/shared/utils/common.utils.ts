import { AbstractControl, FormGroup } from '@angular/forms';
import { NomenclatureDTO } from "app/models/common/generic-nomenclature.model";
import { isArray, isObject } from "lodash";

export class CommonUtils {
    public static readonly MAT_ICON_SIZE: number = 1.714;
    public static readonly FA_ICON_SIZE: number = 1.33;
    public static readonly RECORDS_PER_PAGE: number = 5;

    public static capitalize(value: string): string {
        if (value != undefined && value != '') {
            return value[0].toUpperCase() + value.substr(1);
        } else {
            return value;
        }
    }

    public static getFormControlName(control: AbstractControl): string {
        const parent = control.parent;
        let controlName: string = '';
        if (parent !== null && parent !== undefined) {
            for (const name of Object.keys(parent.controls)) {
                if (control === parent.get(name)) {
                    controlName = name;
                }
            }
        }

        return controlName;
    }

    public static getValueOrDefault<T>(value: unknown): unknown {
        if (value === '') {
            return null;
        } else {
            return value;
        }
    }

    public static toBoolean(value: string | undefined | null): boolean {
        return value?.toLowerCase() == 'true' ? true : false;
    }

    public static sanitizeModelStrings<T>(model: any, trim: boolean = true): T {
        const keys = Object.keys(model);

        for (const property of keys) {
            if (model[property] === '') {
                model[property] = null;
            }

            if (trim && typeof model[property] === 'string') {
                model[property] = (model[property] as string)?.trim();
            }
        }

        return model as T;
    }

    /**
     * Returns whether the parameter passed is null, undefined or equal to empty string or empty array
     * @param value - any object
     */
     public static isNullOrEmpty(obj: any | string | []): boolean {
        if (obj === undefined || obj === null) {
            return true;
        }

        if (typeof obj === 'string' && (obj as string).length === 0) {
            return true;
        }

        if (isObject(obj)) {
            let isEmpty: boolean = true;
            const object = obj as any;
            if (object instanceof Date) {
                isEmpty = false;
            }
            else {
                for (const value of Object.values(object)) {
                    if (!this.isNullOrEmpty(value)) {
                        isEmpty = false;
                        break;
                    }
                }
            }

            if (isEmpty === true) {
                return true;
            }
        }

        if (isArray(obj) && (obj as []).length === 0) {
            return true;
        }

        return false;
    }

    /**
     * Returns whether the parameter is null or undefined
     * @param value can be any object
     */
    public static isNullOrUndefined(value: unknown): boolean {
        return value === undefined || value === null;
    }

    /**
     * Checks whether `num` parameter is null/undefined, empty or NaN.
     * @param num Parameter that is checked whether its a null or NaN.
     */
    public static isNumberNullOrNaN(num: number): boolean {
        return CommonUtils.isNullOrEmpty(num) || isNaN(num);
    }

    static zeroPad = (num: any, places: number) => String(num).padStart(places, '0');

    public static convertKeysToCamelCase(obj: Record<string, unknown> | unknown): unknown | null | undefined {
        if (obj === null || obj === undefined) {
            return obj;
        }
        else if (Array.isArray(obj)) {
            return obj.map(CommonUtils.convertKeysToCamelCase);
        }
        if (typeof obj !== 'object') {
            return obj;
        }
        else {
            const record: Record<string, unknown> = obj as Record<string, unknown>;

            return Array.from(CommonUtils.getProperties(record)).reduce((prev: Record<string, unknown>, current: string) => {
                const newKey: string = `${current[0].toLowerCase()}${current.slice(1)}`;

                if (typeof record[current] === 'object') {
                    const value: unknown = record[current];
                    if (value instanceof Number || value instanceof String || value instanceof Boolean || value instanceof Date) {
                        prev[newKey] = value;
                    }
                    else {
                        prev[newKey] = CommonUtils.convertKeysToCamelCase(record[current]);
                    }
                }
                else {
                    prev[newKey] = record[current];
                }
                return prev;
            }, {});
        }
    }

    public static getProperties(obj: any): Set<string> {
        const lowercase = (str: string) => {
            return `${str[0].toLowerCase()}${str.slice(1)}`;
        };

        const result: Set<string> = new Set<string>();
        for (const property in obj) {
            if (property[0] !== '_') {
                result.add(lowercase(property));
            }
        }

        const prototype = Object.getPrototypeOf(obj);
        if (prototype !== null && prototype !== undefined) {
            const descriptors = Object.getOwnPropertyDescriptors(prototype);
            for (const descriptor in descriptors) {
                if (typeof obj[descriptor] !== 'function' && descriptor[0] !== '_') {
                    result.add(lowercase(descriptor));
                }
            }
        }
        return result;
    }

    public static isNomenclature<T>(obj: NomenclatureDTO<T> | string): obj is NomenclatureDTO<T> {
        if (obj !== null && obj !== undefined && typeof obj === 'object') {
            return 'value' in obj && 'displayName' in obj;
        }
        return false;
    }

    public static isNomenclatures<T>(obj: NomenclatureDTO<T>[] | string[]): obj is NomenclatureDTO<T>[] {
        if (obj !== null && obj !== undefined && Array.isArray(obj)) {
            if (typeof obj[0] === 'object') {
                return 'value' in obj[0] && 'displayName' in obj[0];
            }
        }
        return false;
    }

    public static nomenclatureDisplayFunction(object: NomenclatureDTO<any> | string | null | undefined): string {
        if (object !== null && object !== undefined) {
            if (typeof object === 'string') {
                return object;
            }
            else if (object.displayName !== null && object.displayName !== undefined) {
                return object.displayName;
            }
        }

        return '';
    }

    public static clearFormControl(form: FormGroup, controlName: string): void {
        form.get(controlName)!.reset();
        form.get(controlName)!.markAsTouched();
    }

    public static filterOptions<T>(
        filteredOptions: NomenclatureDTO<T>[] | string[],
        options: NomenclatureDTO<T>[], 
        value: NomenclatureDTO<T> | string | null | undefined
        ): NomenclatureDTO<T>[] | string[] {
        if (CommonUtils.isNomenclatures(options)) {
            filteredOptions = this.filterNomeclatureOptions<T>(options, value as NomenclatureDTO<T>);
        }
        else {
            filteredOptions = this.filterStringOptions(options, value as string);
        }

        return filteredOptions;
    }

    private static filterNomeclatureOptions<T>(options: NomenclatureDTO<T>[], value: string | NomenclatureDTO<T> | null | undefined): NomenclatureDTO<T>[] {
        if (value !== null && value !== undefined) {

            let filterValue = '';

            if (CommonUtils.isNomenclature(value)) {
                filterValue = value.displayName?.toLowerCase() ?? '';
            }
            else {
                filterValue = value.toLowerCase();
            }

            return options.filter((option: NomenclatureDTO<T>) => {
                if (option.displayName?.toLocaleLowerCase()?.includes(filterValue)) {
                    return true;
                }
                else {
                    return false;
                }
            });
        }

        return options.slice();
    }

    private static filterStringOptions(options: string[], value: string) {
        if (value !== null && value !== undefined) {
            const filterValue: string = value.toLowerCase();

            return options.filter((option: string) => {
                return option.toLowerCase().includes(filterValue);
            });
        }

        return options.slice();
    }
}