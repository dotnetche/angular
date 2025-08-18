import { HttpParams } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { RequestService } from 'app/services/common/request.service';
import { Observable } from 'rxjs';

export class WebTranslateLoader implements TranslateLoader {
    public constructor (private http: RequestService) { }

    public getTranslation(lang: string): Observable<any> {
        const params = new HttpParams().append('language', lang);
        return this.http.get('Resources', 'GetWebResources', undefined, { httpParams: params });
    }
}