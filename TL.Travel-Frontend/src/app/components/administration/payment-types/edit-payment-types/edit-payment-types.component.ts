import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PaymentTypeDTO } from 'app/models/administration/payment-type.model';
import { PaymentTypesService } from 'app/services/administration/payment-types.service';
import { IActionInfo } from 'app/shared/components/dialog-wrapper/interfaces/action-info.interface';
import { DialogCloseCallback } from 'app/shared/components/dialog-wrapper/interfaces/dialog-content.interface';
import { DialogWrapperData } from 'app/shared/components/dialog-wrapper/models/dialog-action-buttons.model';
import { DialogParamsModel } from 'app/shared/components/dialog-wrapper/models/dialog-params.model';

@Component({
  selector: 'app-edit-payment-types',
  templateUrl: './edit-payment-types.component.html',
  styleUrl: './edit-payment-types.component.scss'
})
export class EditPaymentTypesComponent {
  public viewMode: boolean = true;
  public id?: number;
  public form!: FormGroup;

  private readonly service: PaymentTypesService;
  private model: PaymentTypeDTO;

  public constructor(service: PaymentTypesService) {
    this.service = service;
    this.model = new PaymentTypeDTO();
    this.buildForm();
  }


  public async ngOnInit(): Promise<void> {
    if (this.id) {
      this.service.get(this.id).subscribe({
        next: (result: PaymentTypeDTO) => {
          this.model = result;
          this.fillForm();

          if (this.viewMode) {
            this.form.disable();
          }
        }
      });
    }
  }

  public setData(data: DialogParamsModel, wrapperData: DialogWrapperData): void {
    this.viewMode = data.isReadonly;
    this.id = data.id;
  }

  public dialogButtonClicked(actionInfo: IActionInfo, dialogClose: DialogCloseCallback): void {
    dialogClose();
  }

  public saveBtnClicked(actionInfo: IActionInfo, dialogClose: DialogCloseCallback): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.model = this.fillModel();

      if (this.id) {
        this.service.update(this.model).subscribe({
          next: () => {
            dialogClose(this.model);
          }
        });
      }
      else {
        this.service.add(this.model).subscribe({
          next: () => {
            dialogClose(this.model);
          }
        });
      }
    }

  }

  public cancelBtnClicked(actionInfo: IActionInfo, dialogClose: DialogCloseCallback): void {
    dialogClose();
  }

  public closeBtnClicked?(actionInfo: IActionInfo, dialogClose: DialogCloseCallback): void {
    dialogClose();
  }


  private buildForm(): void {
    this.form = new FormGroup({
      nameControl: new FormControl(undefined, [Validators.required, Validators.maxLength(200)]),
    });
  }



  private fillForm(): void {

    this.form.get('nameControl')?.setValue(this.model.name);
  }

  private fillModel(): PaymentTypeDTO {
    this.model.name = this.form.get('nameControl')?.value;
    return this.model;
  }
}
