import { ITranslateService, Locale } from 'app/shared/interfaces/translate-service.interface';
import { TranslateService as TranslationService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TranslateService implements ITranslateService {
    private translationService: TranslationService;

    public constructor(translationService: TranslationService) {
        this.translationService = translationService;
    }

    public loadTranslations(...args: Locale[]): void {
        const locales = [...args];

        for (let locale of locales) {
            this.translationService.setTranslation(locale.lang, locale.data, locale.shouldMerge);
            this.translationService.setDefaultLang(locale.lang);
        }
    }

    /**
     * Gets the string value for the given key from the loaded translations
     * @key - code of the translation
     */
    public getValue(key: string): string {
        if (key?.length > 0) {
            return this.translationService.instant(key);
        }
        else {
            return '';
        }
    }

}