import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OfficeService } from '@core/services/office.service';
import { NewOffice } from '@core/interfaces/new-office.interface';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
    selector: 'app-office-form',
    imports: [ModalComponent, ReactiveFormsModule],
    templateUrl: './office-form.component.html',
    styleUrl: './office-form.component.css'
})
export class OfficeFormComponent 
{
    private officeService = inject(OfficeService);
    private fb = inject(FormBuilder);

    cancel = output<void>();
    confirm = output<void>();

    errorMessage = '';

    officeForm = this.fb.group(
    {
        city: ['', Validators.required],
        address: ['', Validators.required],
        type: ['', Validators.required]
    });

    onCancel()
    {
        this.cancel.emit();
    }

    onSubmit()
    {
        if (!this.officeForm.valid)
        {
            this.officeForm.markAllAsTouched();
            return;
        }

        const formData = this.officeForm.getRawValue() as NewOffice;

        // Упевніться, що у вас є метод createOffice у OfficeService
        this.officeService.createOffice(formData)
            .subscribe(
            {
                next: () => this.confirm.emit(),
                error: err => 
                { 
                    this.errorMessage = err?.error?.msg || 'Помилка при створенні'; 
                    console.error(err); 
                }
            });
    }
}
