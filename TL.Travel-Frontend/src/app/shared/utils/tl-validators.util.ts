import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { NomenclatureDTO } from "app/models/common/generic-nomenclature.model";
import { CommonUtils } from './common.utils';

export class TLValidators {

    /**
    * Includes: 
    * - At least 8 characters in length both cyrilic or latin;
    * - Lowercase letters or Uppercase letters;
    * - Numbers;
    * - Special characters;
    * */
    public static COMPLEXITY_PATTERN = `(?=.*[a-zA-Z\u0401\u0451\u0410-\u044f])(?=.*[0-9])(?=.*[$@!%*?&]).{8,}`;

    /**
     * Confirm password validator
     *
     * @param {AbstractControl} control
     * @param {string} passwordControlName A string value that defines the name of the password control.
     * @param {string} confirmPasswordControlName A string value that defines the name of the confirmPassword control.
     * @returns {ValidationErrors | null}
     */
    public static confirmPasswordValidator(passwordControlName: string = 'password', confirmPasswordControlName: string = 'passwordConfirmation'): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.parent || !control) {
                return null;
            }

            const password = control.parent.get(passwordControlName);
            const passwordConfirmation = control.parent.get(confirmPasswordControlName);

            if (!password || !passwordConfirmation) {
                return null;
            }

            if (passwordConfirmation.value === '' || passwordConfirmation.value === null || passwordConfirmation.value === undefined) {
                return null;
            }

            if (password.value === passwordConfirmation.value) {
                return null;
            }

            return { passwordsNotMatching: true };
        };
    }

    /**
     * Checks if the value of the form control is in the passed as a parameter collection `options`. 
     * @param options - collection in which the value of the form control is searched in
     * @returns `selectedvaluefromdropdown` as true, if the value is not in the desired collection and otherwise - `selectedvaluefromdropdown` as false
     */
    public static selectedValueFromDropdownValidator(options: NomenclatureDTO<any>[] | string[]): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value !== null && control.value !== undefined && control.value !== '') {
                if (CommonUtils.isNomenclatures(options)) {
                    if (!CommonUtils.isNomenclature(control.value)) {
                        return { 'selectedvaluefromdropdown': true };
                    }
                }
                else {
                    if (!options.some(x => { return x === control.value })) {
                        return { 'selectedvaluefromdropdown': true };
                    }
                }
            }
            return null;
        }
    }

    /**
     * Deletes all characters from the form control value if they are not numbers, signs or decimal number delimiters (with regex: `/[^0-9.,-]/g`)
     * @param min minimum number of form control
     * @param max maximum number of form control
     * @returns if min error - { min: value } and if max error - { max: value }
     */
    public static number(min?: number, max?: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value !== undefined && control.value !== null) {
                const str: string = typeof control.value !== 'string' ? control.value.toString() : control.value;

                // trim, replace all commas with dot, remove all non-numeric symbols
                let newStr: string = str.trim().replace(',', '.').replace(/[^0-9.,-]/g, '');

                // if the number is positive, remove all minus signs
                if (min !== undefined && min >= 0) {
                    newStr = newStr.replace('-', '');
                }
                // if the number doesn't have to be positive, remove all minus signs that aren't in the beginning
                else if (newStr.length > 0) {
                    newStr = `${newStr[0]}${newStr.slice(1).replace('-', '')}`;
                }

                // remove all dots which aren't a first occurence
                const dotIdx: number = newStr.indexOf('.');
                if (dotIdx !== -1 && newStr.length > dotIdx && newStr.length > 1) {
                    newStr = `${newStr.slice(0, dotIdx + 1)}${newStr.slice(dotIdx + 1).replace('.', '')}`;
                }

                if (str !== newStr) {
                    control.setValue(newStr);
                }

                if (newStr.length !== 0) {
                    const num: number = Number(newStr);

                    if (min !== undefined && num < min) {
                        return { min: min };
                    }

                    if (max !== undefined && num > max) {
                        return { max: max };
                    }
                }
            }
            return null;
        };
    }
}