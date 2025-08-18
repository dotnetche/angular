import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RouterModule } from '@angular/router';

import { ErrorSnackbarComponent } from './components/snackbar/error-snackbar/error-snackbar.component';
import { SpinnerComponent } from './components/tl-spinner/spinner.component';
import { TLDataTableModule } from './components/data-table/data-table.module';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { MaterialModule } from 'app/shared/modules/material.module';
import { TLPipesModule } from './pipes/tl-pipes.module';
import { DialogWrapperComponent } from './components/dialog-wrapper/dialog-wrapper.component';
import { MatFormFieldControl } from '@angular/material/form-field';

@NgModule({
    declarations: [
        ErrorSnackbarComponent,
        SpinnerComponent,
        ConfirmationDialogComponent,
        DialogWrapperComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        MaterialModule,
        FontAwesomeModule,
        TLDataTableModule,
        TLPipesModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        MaterialModule,
        FontAwesomeModule,
        TLDataTableModule,
        TLPipesModule
    ],
    providers: [
        DatePipe
    ]
})
export class SharedModule {
}
