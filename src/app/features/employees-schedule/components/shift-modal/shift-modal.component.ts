import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Office } from '@core/interfaces/office.interface';
import { OfficeService } from '@core/services/office.service';
import { ShiftType } from '@features/employees-schedule/enums/shift-type.enum';
import { EmployeeScheduleService } from '@features/employees-schedule/services/employee-schedule.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { NewShift } from '@features/employees-schedule/interfaces/new-shift.interface';

@Component({
    selector: 'app-shift-modal',
    imports: [ModalComponent, ReactiveFormsModule],
    providers: [DatePipe],
    templateUrl: './shift-modal.component.html',
    styleUrl: './shift-modal.component.css'
})
export class ShiftModalComponent implements OnInit
{
    private employeeScheduleService = inject(EmployeeScheduleService);
    private officeService = inject(OfficeService);
    private fb = inject(FormBuilder);
    private dp = inject(DatePipe);

    employeeId = input.required<number>();

    cancel = output<void>();
    confirm = output<void>();

    ShiftType = ShiftType;
    errorMessage = '';
    today = this.dp.transform(new Date(), 'yyyy-MM-dd') ?? '';

    cities: string[] = [];
    offices: Office[] = [];
    selectedOffice: Office | null = null;
    officeOpenTime: string | null = null;
    officeCloseTime: string | null = null;

    shiftForm = this.fb.group({
        shiftType:  ['', Validators.required],
        startDate:  [{ value: '', disabled: true }],
        endDate:    [{ value: '', disabled: true }],
        city:       [{ value: '', disabled: true }],
        officeId:   [{ value: '', disabled: true }],
        startTime:  [{ value: '', disabled: true }],
        endTime:    [{ value: '', disabled: true }]
    });

    get isWorkType(): boolean
    {
        return this.shiftForm.get('shiftType')?.value === ShiftType.Work;
    }

    get isPeriodType(): boolean
    {
        const t = this.shiftForm.get('shiftType')?.value;
        return t === ShiftType.DayOff || t === ShiftType.Vacation || t === ShiftType.SickLeave;
    }

    ngOnInit(): void
    {
        this.officeService.getCities().subscribe({
            next: cities => this.cities = cities,
            error: err => console.error(err)
        });
    }

    onShiftTypeChange(): void
    {
        // скидаємо все
        this.shiftForm.patchValue({ startDate: '', endDate: '', city: '', officeId: '', startTime: '', endTime: '' });
        this.offices = [];
        this.selectedOffice = null;
        this.officeOpenTime = null;
        this.officeCloseTime = null;

        const controls = ['startDate', 'endDate', 'city', 'officeId', 'startTime', 'endTime'];
        controls.forEach(c => {
            this.shiftForm.get(c)?.disable({ emitEvent: false });
            this.shiftForm.get(c)?.clearValidators();
            this.shiftForm.get(c)?.updateValueAndValidity();
        });

        if (this.isWorkType)
        {
            ['startDate', 'city', 'officeId', 'startTime', 'endTime'].forEach(c => {
                this.shiftForm.get(c)?.setValidators(Validators.required);
                this.shiftForm.get(c)?.updateValueAndValidity();
            });
            this.shiftForm.get('startDate')?.enable({ emitEvent: false });
            this.shiftForm.get('city')?.enable({ emitEvent: false });
        }
        else if (this.isPeriodType)
        {
            ['startDate', 'endDate'].forEach(c => {
                this.shiftForm.get(c)?.setValidators(Validators.required);
                this.shiftForm.get(c)?.updateValueAndValidity();
                this.shiftForm.get(c)?.enable({ emitEvent: false });
            });
        }
    }

    onCityChange(): void
    {
        const city = this.shiftForm.get('city')?.value;
        this.shiftForm.patchValue({ officeId: '', startTime: '', endTime: '' }, { emitEvent: false });
        this.shiftForm.get('officeId')?.disable({ emitEvent: false });
        this.shiftForm.get('startTime')?.disable({ emitEvent: false });
        this.shiftForm.get('endTime')?.disable({ emitEvent: false });
        this.selectedOffice = null;
        this.officeOpenTime = null;
        this.officeCloseTime = null;

        if (!city) return;

        this.officeService.getOffices(city, null).subscribe({
            next: offices => {
                this.offices = offices;
                this.shiftForm.get('officeId')?.enable({ emitEvent: false });
            },
            error: err => console.error(err)
        });
    }

    onOfficeChange(): void
    {
        const officeId = this.shiftForm.get('officeId')?.value;
        const dateStr = this.shiftForm.get('startDate')?.value;

        this.shiftForm.patchValue({ startTime: '', endTime: '' }, { emitEvent: false });
        this.shiftForm.get('startTime')?.disable({ emitEvent: false });
        this.shiftForm.get('endTime')?.disable({ emitEvent: false });

        if (!officeId || !dateStr) return;

        this.selectedOffice = this.offices.find(o => o.id === Number(officeId)) || null;

        const dayOfWeek = new Date(dateStr).getDay();

        this.officeService.getOfficeWorkingHours(Number(officeId), dayOfWeek).subscribe({
            next: hours => {
                if (hours) {
                    this.officeOpenTime = hours.openTime.slice(0, 5);
                    this.officeCloseTime = hours.closeTime.slice(0, 5);
                    this.errorMessage = '';
                    this.shiftForm.get('startTime')?.enable({ emitEvent: false });
                    this.shiftForm.get('endTime')?.enable({ emitEvent: false });
                } else {
                    this.errorMessage = 'Відділення не працює у цей день!';
                    this.officeOpenTime = null;
                    this.officeCloseTime = null;
                }
            },
            error: err => console.error(err)
        });
    }

    onCancel(): void
    {
        this.cancel.emit();
    }

    onSubmit(): void
    {
        if (!this.shiftForm.valid)
        {
            this.shiftForm.markAllAsTouched();
            return;
        }

        const formData = this.shiftForm.getRawValue();

        if (this.isWorkType && this.officeOpenTime && this.officeCloseTime)
        {
            if (formData.startTime! < this.officeOpenTime || formData.endTime! > this.officeCloseTime)
            {
                this.errorMessage = `Час зміни має бути між ${this.officeOpenTime} та ${this.officeCloseTime}`;
                return;
            }
            if (formData.startTime! >= formData.endTime!)
            {
                this.errorMessage = 'Час початку має бути меншим за час завершення';
                return;
            }
        }

        if (this.isPeriodType && formData.startDate! > formData.endDate!)
        {
            this.errorMessage = 'Дата початку має бути раніше дати завершення';
            return;
        }

        const request = {
            employeeId: this.employeeId(),
            type: formData.shiftType!,
            startDate: formData.startDate!,
            endDate: this.isPeriodType ? formData.endDate! : formData.startDate!,
            officeId: this.isWorkType ? Number(formData.officeId) : null,
            startTime: this.isWorkType ? formData.startTime : null,
            endTime: this.isWorkType ? formData.endTime : null
        } as NewShift;

        this.employeeScheduleService.createShift(request).subscribe({
            next: () => this.confirm.emit(),
            error: err => {
                this.errorMessage = err?.error?.msg || 'Помилка';
                console.error(err);
            }
        });
    }
}