import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Office } from '@core/interfaces/office.interface';
import { OfficeService } from '@core/services/office.service';
import { NewRegularShift } from '@features/employees-schedule/interfaces/new-regular-shift.interface';
import { RegularShift } from '@features/employees-schedule/interfaces/regular-shift.interface';
import { UpdateRegularShift } from '@features/employees-schedule/interfaces/update-regular-shift.interface';
import { EmployeeScheduleService } from '@features/employees-schedule/services/employee-schedule.service';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
    selector: 'app-regular-shift-modal',
    imports: [ModalComponent, ReactiveFormsModule],
    templateUrl: './regular-shift-modal.component.html',
    styleUrl: './regular-shift-modal.component.css'
})
export class RegularShiftModalComponent implements OnInit
{
    private employeeScheduleService = inject(EmployeeScheduleService);
    private officeService = inject(OfficeService);
    private fb = inject(FormBuilder);

    // ВАШ СТИЛЬ:
    shift = input<RegularShift | null>(null);
    dayOfWeek = input.required<number>();
    employeeId = input.required<number>(); // Потрібно для створення

    cancel = output<void>();
    confirm = output<void>(); 

    errorMessage = '';

    cities: string[] = [];
    offices: Office[] = [];

    selectedOffice: Office | null = null;

    officeOpenTime: string | null = null;
    officeCloseTime: string | null = null;

    shiftForm = this.fb.group(
    {
        city: ['', Validators.required],
        officeId: [{ value: '', disabled: true }, Validators.required],
        startTime: [{ value: '', disabled: true }, Validators.required],
        endTime: [{ value: '', disabled: true }, Validators.required]
    });

    get isEditMode(): boolean 
    {
        return this.shift() !== null;
    }

    get title(): string 
    {
        return this.isEditMode ? 'Редагувати зміну' : 'Додати зміну';
    }

    ngOnInit(): void 
    {
        this.officeService.getCities().subscribe(
        {
            next: cities => 
            {
                this.cities = cities;
                
                if (this.isEditMode)
                {
                    this.shiftForm.patchValue({ city: this.shift()!.officeCity });
                    this.onCityChange(true);
                }
            },
            error: err => console.error(err)
        });
    }

    onCityChange(isInit = false): void
    {
        const city = this.shiftForm.get('city')?.value;
        
        if (!city) 
        {
            this.shiftForm.get('officeId')?.disable();
            this.shiftForm.get('startTime')?.disable();
            this.shiftForm.get('endTime')?.disable();
            this.shiftForm.patchValue({ officeId: '', startTime: '', endTime: '' });
            this.selectedOffice = null;
            return;
        }

        this.officeService.getOffices(city, null).subscribe(
        {
            next: offices => 
            {
                this.offices = offices;
                
                this.shiftForm.get('officeId')?.enable();
                
                if (isInit && this.isEditMode)
                {
                    const office = this.offices.find(o => o.number === this.shift()!.officeNumber);
                    if (office)
                    {
                        this.shiftForm.patchValue(
                        { 
                            officeId: office.id.toString(),
                            startTime: this.shift()!.startTime.slice(0, 5),
                            endTime: this.shift()!.endTime.slice(0, 5)
                        });
                        this.onOfficeChange();
                    }
                }
                else
                {
                    this.shiftForm.get('startTime')?.disable();
                    this.shiftForm.get('endTime')?.disable();
                    this.shiftForm.patchValue({ officeId: '', startTime: '', endTime: '' });
                    this.selectedOffice = null;
                    this.officeOpenTime = null;
                    this.officeCloseTime = null;
                }
            },
            error: err => console.error(err)
        });
    }

    onOfficeChange(): void
    {
        const officeId = this.shiftForm.get('officeId')?.value;
        
        if (!officeId) 
        {
            this.shiftForm.get('startTime')?.disable();
            this.shiftForm.get('endTime')?.disable();
            this.shiftForm.patchValue({ startTime: '', endTime: '' });
            return;
        }

        this.selectedOffice = this.offices.find(o => o.id === Number(officeId)) || null;

        this.officeService.getOfficeWorkingHours(Number(officeId), this.dayOfWeek())
            .subscribe(
            {
                next: hours => 
                {
                    if (hours) 
                    {
                        this.officeOpenTime = hours.openTime.slice(0, 5);
                        this.officeCloseTime = hours.closeTime.slice(0, 5);
                        this.errorMessage = '';
                        
                        this.shiftForm.get('startTime')?.enable();
                        this.shiftForm.get('endTime')?.enable();
                    } 
                    else 
                    {
                        this.errorMessage = 'Відділення не працює у цей день!';
                        this.officeOpenTime = null;
                        this.officeCloseTime = null;
                        
                        this.shiftForm.get('startTime')?.disable();
                        this.shiftForm.get('endTime')?.disable();
                        this.shiftForm.patchValue({ startTime: '', endTime: '' });
                    }
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
        if (!this.shiftForm.valid || !this.selectedOffice)
        {
            this.shiftForm.markAllAsTouched();
            return;
        }

        const formData = this.shiftForm.getRawValue();

        if (this.officeOpenTime && this.officeCloseTime)
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

        if (!this.isEditMode)
        {
            const newShift = 
            {
                employeeId: this.employeeId(),
                dayOfWeek: this.dayOfWeek(),
                officeId: this.selectedOffice.id,
                startTime: formData.startTime!,
                endTime: formData.endTime!
            } as NewRegularShift;

            this.employeeScheduleService.createRegularShift(newShift).subscribe(
            {
                next: () => this.confirm.emit(),
                error: err => 
                { 
                    this.errorMessage = err?.error?.msg || 'Помилка'; 
                    console.error(err); 
                }
            });
        }
        else
        {
            const updatedShift = 
            {
                id: this.shift()!.id,
                dayOfWeek: this.dayOfWeek(),
                officeId: this.selectedOffice.id,
                startTime: formData.startTime!,
                endTime: formData.endTime!
            } as UpdateRegularShift;

            this.employeeScheduleService.updateRegularShift(updatedShift).subscribe(
            {
                next: () => this.confirm.emit(),
                error: err => 
                { 
                    this.errorMessage = err?.error?.msg; 
                    console.error(err); 
                }
            });
        }
    }
}