export type MatSnackBarHorizontalPosition = 'start' | 'center' | 'end' | 'left' | 'right';
export type MatSnackBarVerticalPosition = 'top' | 'bottom';

export class RequestProperties {

    public static get DEFAULT(): RequestProperties {
        return new RequestProperties();
    }

    public static get NO_SPINNER(): RequestProperties {
        return new RequestProperties({
            showException: true,
            rethrowException: false,
            showProgressSpinner: false,
        });
    }

    public static get FORM_DATA(): RequestProperties {
        return new RequestProperties({
            asFormData: true,
        });
    }

    public showException?: boolean = true;
    public rethrowException?: boolean = true;
    public showProgressSpinner?: boolean = true;
    public errorColorClass?: string = 'snack-bar-error-color';
    public errorDuration?: number = 6000;
    public successColorClass?: string = 'snack-bar-success-color';
    public successDuration?: number = 3000;
    public snackbarHorizontalPosition?: MatSnackBarHorizontalPosition = 'center';
    public snackbarVerticalPosition?: MatSnackBarVerticalPosition = 'bottom';
    public asFormData?: boolean = false;
    public asText?: boolean = false;

    public constructor(props?: Partial<RequestProperties>) {
        this.showException = true;
        this.rethrowException = true;
        this.showProgressSpinner = true;
        this.errorColorClass = 'snack-bar-error-color';
        this.errorDuration = 6000;
        this.successColorClass = 'snack-bar-success-color';
        this.successDuration = 3000;
        this.snackbarHorizontalPosition = 'center';
        this.snackbarVerticalPosition = 'bottom';
        this.asFormData = false;
        this.asText = false;

        if (props != undefined) {
            for (const key of Object.keys(props)) {
                (this as any)[key] = (props as any)[key];
            }
        }
    }
}