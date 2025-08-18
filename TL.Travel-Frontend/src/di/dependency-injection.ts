import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, FactoryProvider, Injector, LOCALE_ID, Provider, Type } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
// import { AuthInterceptor } from 'app/core/auth/auth.interceptor';
import { TranslateService } from 'app/core/translation/translate.service';
import { TranslationUtils } from 'app/core/translation/translation-utils';
import { StorageService } from 'app/services/common/local-storage.service';
import { PermissionsService } from 'app/services/common/permissions.service';
import { SecurityService } from 'app/services/common/security.service';
import { StorageTypes } from 'app/shared/enums/storage-types.enum';
import { ISecurityService } from 'app/shared/interfaces/security-service.interface';
import { TLDateAdapter } from 'app/shared/utils/date.adapter';
import { DateUtils } from 'app/shared/utils/date.utils';
import { TranslatedMatPaginatorIntl } from 'app/shared/utils/translated.paginator';

export function loadTranslationResources(translateService: TranslateService, securityService: ISecurityService): () => void {

    return async () => {
        let language: string;
        const localStorageService = StorageService.getStorage(StorageTypes.Local);

        if (await localStorageService.hasItem('lang')) {
            language = await localStorageService.get('lang') as string;
        }
        else {
            localStorageService.addOrUpdate('lang', 'bg');
            language = 'bg';
        }

        let backupTranslation = TranslationUtils.getLocalTranslations(language);
        translateService.loadTranslations(...backupTranslation);
    };
}

export class DIContainer {

    public static AppInjector: Injector;

    public static DEPENDENCY_INJECTION_INITIALIZER: Provider[] = [
        {
            provide: 'ISecurityService',
            useExisting: SecurityService
        },
        {
            provide: 'ITranslateService',
            useExisting: TranslateService
        },
        {
            provide: 'IPermissionsService',
            useExisting: PermissionsService
        },
        {
            provide: APP_INITIALIZER,
            useFactory: loadTranslationResources,
            multi: true,
            deps: [TranslateService, SecurityService]
        },
        // {
        //     provide: HTTP_INTERCEPTORS,
        //     useClass: AuthInterceptor,
        //     multi: true
        // },
        {
            provide: MatPaginatorIntl,
            useClass: TranslatedMatPaginatorIntl
        },
        {
            provide: DateAdapter,
            useClass: TLDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS,
            useValue: DateUtils.TL_DATE_FORMATS
        }
    ];

}