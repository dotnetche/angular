import { SimpleAuditDTO } from 'app/models/common/simple-audit.model';
import { Observable } from 'rxjs';

export interface IHeaderAuditButton {
  tooltip?: string;
  getAuditRecordData: (id: number) => Observable<SimpleAuditDTO>;
  id: number;
  tableName?: string;
}
