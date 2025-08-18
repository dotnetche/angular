import { TLError } from "../models/tl-error.model";

export type GetControlErrorLabelTextCallback = (controlName: string, error: unknown, errorCode: string) => TLError | undefined;