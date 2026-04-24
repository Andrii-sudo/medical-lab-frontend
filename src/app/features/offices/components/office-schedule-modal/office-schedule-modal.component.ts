import { Component, inject, input, output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { OfficeSchedule } from '@core/interfaces/office-schedule.interface';
import { Office } from '@core/interfaces/office.interface';
import { OfficeService } from '@core/services/office.service';
import { ModalComponent } from '@shared/components/modal/modal.component';

function timeRangeValidator(group: AbstractControl): ValidationErrors | null 
{
    const open = group.get('openTime')?.value;
    const close = group.get('closeTime')?.value;

    if ((open && !close) || (!open && close)) return { incomplete: true };
    if (open && close && open >= close) return { invalidRange: true };
    
    return null;
}

@Component({
    selector: 'app-office-schedule-modal',
    imports: [ModalComponent, ReactiveFormsModule],
    templateUrl: './office-schedule-modal.component.html',
    styleUrl: './office-schedule-modal.component.css'
})
export class OfficeScheduleModalComponent 
{
    private officeService = inject(OfficeService);
    private fb = inject(FormBuilder);

    office = input.required<Office>();
    
    cancel = output<void>();
    confirm = output<void>();

    errorMessage = '';

    dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
    daysOrder = [1, 2, 3, 4, 5, 6, 0];

    scheduleForm = this.fb.group(
    {
        days: this.fb.array(
            this.daysOrder.map(day => this.fb.group(
            {
                dayOfWeek: [day],
                openTime: [''],
                closeTime: ['']
            }, { validators: timeRangeValidator }))
        )
    });

    get daysControls() 
    {
        return (this.scheduleForm.get('days') as FormArray).controls as FormGroup[];
    }

    ngOnInit(): void 
    {
        this.officeService.getOfficeSchedule(this.office().id).subscribe(
        {
            next: (schedules) => 
            {
                const patchData = this.daysOrder.map(day => 
                {
                    const existing = schedules.find(s => s.dayOfWeek === day);
                    return {
                        dayOfWeek: day,
                        openTime: existing?.openTime ? existing.openTime.slice(0, 5) : '',
                        closeTime: existing?.closeTime ? existing.closeTime.slice(0, 5) : ''
                    };
                });
                
                this.scheduleForm.get('days')?.patchValue(patchData);
            },
            error: err => console.error(err)
        });
    }

    onCancel() 
    {
        this.cancel.emit();
    }

    onSubmit() 
    {
        if (this.scheduleForm.invalid) 
        {
            this.scheduleForm.markAllAsTouched();
            this.errorMessage = 'Перевірте правильність заповнення часу';
            return;
        }

        const formData = this.scheduleForm.getRawValue().days as OfficeSchedule[];
        const validSchedules = formData.filter(d => d.openTime && d.closeTime);

        this.officeService.updateOfficeSchedule(this.office().id, validSchedules)
            .subscribe(
                {
                    next: () => this.confirm.emit(),
                    error: err => 
                    {
                        this.errorMessage = err?.error?.msg || 'Помилка збереження';
                        console.error(err);
                    }
                });
    }
}
