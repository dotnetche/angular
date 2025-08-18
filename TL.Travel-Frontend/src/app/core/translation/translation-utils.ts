import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { administrative_BG_resouces } from 'app/components/administration/i18n/bg';
import { bookings_BG_resouces } from 'app/components/bookings/i18n/bg';
import { home_BG_resouces } from 'app/components/home/i18n/bg';
import { RequestService } from 'app/services/common/request.service';
import { FileTranslateLoader } from './http-file-translation.loader';
import { WebTranslateLoader } from './http-translation.loader';
import { Translation } from './translation.model';
import { lastValueFrom } from 'rxjs';
import { common_BG_resources } from 'app/shared/i18n/bg';
import { auth_BG_resources } from '../auth/i18n/bg';

const administrative_EN_resouces = {  };
const bookings_EN_resouces = { };
const home_EN_resouces = { };
const common_EN_resources = { };
const auth_EN_resources = { };

export class TranslationUtils {
    public static getFileTranslationLoader(httpClient: HttpClient): TranslateLoader {
        return new FileTranslateLoader(httpClient);
    }

    public static getWebTranslationLoader(requestService: RequestService): TranslateLoader {
        return new WebTranslateLoader(requestService);
    }

    public static async getTranslationsFromLoader(translationLoader: TranslateLoader, language: string): Promise<Translation | undefined> {
        const translation = await lastValueFrom(translationLoader.getTranslation(language));
        if (translation != undefined) {
            return new Translation(language, translation);
        } else {
            return undefined;
        }
    }

    public static getLocalTranslations(language: string): Translation[] {
        if (language === 'bg') {
            return [
                new Translation(language, administrative_BG_resouces, true),
                new Translation(language, bookings_BG_resouces, true),
                new Translation(language, home_BG_resouces, true),
                new Translation(language, common_BG_resources, true),
                new Translation(language, auth_BG_resources, true)
            ];
        }
        else {
            return [
                new Translation(language, administrative_EN_resouces, true),
                new Translation(language, bookings_EN_resouces, true),
                new Translation(language, home_EN_resouces, true),
                new Translation(language, common_EN_resources, true),
                new Translation(language, auth_EN_resources, true)
            ];
        }
    }
}