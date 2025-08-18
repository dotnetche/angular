import { Inject, Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { ErrorType } from "app/shared/enums/error-types.enum";
import { ITranslateService } from "app/shared/interfaces/translate-service.interface";
import { ErrorModel } from "app/shared/models/common/error.model";
import { RequestProperties } from "app/shared/models/common/request-properties.model";
import { ErrorSnackbarComponent } from "./error-snackbar/error-snackbar.component";

@Injectable({
    providedIn: 'root'
})
export class TLSnackbar {
    private readonly snackbar: MatSnackBar;
    private readonly translateService: ITranslateService;

    public constructor(snackbar: MatSnackBar, @Inject('ITranslateService') translateService: ITranslateService) {
        this.snackbar = snackbar;
        this.translateService = translateService;
    }

    public success(successMessage: string, duration?: number, panelClass?: string, config?: MatSnackBarConfig): void {

        if (config == undefined) {
            config = new MatSnackBarConfig();
            const properties = RequestProperties.DEFAULT;
            config.horizontalPosition = properties.snackbarHorizontalPosition;
            config.verticalPosition = properties.snackbarVerticalPosition;
            config.duration = duration ?? properties.successDuration;
            config.panelClass = [(panelClass ?? properties.successColorClass!)];
        }

        this.snackbar.open(successMessage, undefined, config);
    }

    public successResource(resource: string, duration?: number, panelClass?: string): void {
        const message = this.translateService.getValue(resource);
        this.success(message, duration, panelClass);
    }

    public error(errorMessage: string, duration?: number, panelClass?: string): void {
        const error = new ErrorModel({
            messages: [errorMessage],
            type: ErrorType.Unhandled
        });

        let properties = RequestProperties.DEFAULT;

        properties.errorDuration = duration ?? properties.errorDuration;
        properties.errorColorClass = panelClass ?? properties.errorColorClass;

        return this.errorModel(error, properties);
    }

    public errorModel(error: ErrorModel, properties?: RequestProperties): void {

        if (properties == undefined) {
            properties = RequestProperties.DEFAULT;
        }

        this.snackbar.openFromComponent(ErrorSnackbarComponent, {
            data: error,
            duration: properties.errorDuration,
            panelClass: properties.errorColorClass,
        });
    }

    public errorResource(resource: string, duration?: number, panelClass?: string): void {
        const message = this.translateService.getValue(resource);
        return this.error(message, duration, panelClass);
    }
}