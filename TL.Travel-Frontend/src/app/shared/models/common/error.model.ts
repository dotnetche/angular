import { ErrorType } from "app/shared/enums/error-types.enum";

export class ErrorModel {
  public id: number = 0;
  public messages: string[] = [];
  public type: ErrorType = ErrorType.Unhandled;
  public code: number | undefined;

  public constructor(obj?: Partial<ErrorModel>) {
    Object.assign(this, obj);
  }
}
