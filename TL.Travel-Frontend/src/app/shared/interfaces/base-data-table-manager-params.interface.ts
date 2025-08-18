import { Observable } from 'rxjs';

import { GridResultModel } from 'app/models/common/grid-result.model';
import { BaseGridRequestModel } from 'app/models/common/base-grid-request.model';
import { IRemoteTLDatatableComponent } from 'app/shared/components/data-table/interfaces/tl-remote-datatable.interface';

export interface IBaseDatatableManagerParams<TDataModel> {
    tlDataTable: IRemoteTLDatatableComponent;
    requestServiceMethod: (request: BaseGridRequestModel) => Observable<GridResultModel<TDataModel>>;
}