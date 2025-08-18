export interface Locale {
    lang: string;
    data: Record<string, string>;
    shouldMerge: boolean;
}

export interface ITranslateService {
    /**
     * Gets the string value for the given key from the loaded translations
     * @key - code of the translation resource
     */
    getValue(key: string): string;

    loadTranslations(...args: Locale[]): void;
}
