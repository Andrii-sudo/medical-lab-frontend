import { Component, inject, input, OnInit, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NewAppointment } from '../../interfaces/new-appointment.interface';
import { AppointmentPurpose } from '../../enums/appointment-purpose.enum';
import { Office } from '../../interfaces/office.interface';
import { ModalComponent } from "@shared/components/modal/modal.component";
import { DatePipe } from '@angular/common';
import { OfficeService } from '@features/patients/services/office.service';
import { OfficeType } from '@core/enums/office-type';
import { AppointmentService } from '@features/patients/services/appointment.service';

@Component({
    selector: 'app-appointment-form',
    imports: [ReactiveFormsModule, ModalComponent],
    providers: [DatePipe],
    templateUrl: './appointment-form.component.html',
    styleUrl: './appointment-form.component.css'
})
export class AppointmentFormComponent implements OnInit
{
    private officeService = inject(OfficeService);
    private appointmentService = inject(AppointmentService);

    private fb = inject(FormBuilder);
    private dp = inject(DatePipe);

    patientId = input.required<number>();
    patientFirstName = input.required<string>();
    patientLastName = input.required<string>();
    
    cancel = output<void>();
    confirm = output<void>();

    errorMessage = '';

    appointmentPurpose = AppointmentPurpose;

    appointmentForm = this.fb.group({
        visitDate: ['', Validators.required],
        visitTime: ['', Validators.required],
        city: ['', Validators.required],
        officeId: ['', Validators.required],
        visitPurpose: ['', Validators.required]
    });

    today = this.dp.transform(new Date(), 'yyyy-MM-dd') ?? '';
    
    cities: string[] = [];
    offices: Office[] = [];
    availableSlots: string[] = [];

    ngOnInit(): void
    {
        this.loadCities();
        
        this.appointmentForm.get('city')!.disable({ emitEvent: false });
        this.appointmentForm.get('officeId')!.disable({ emitEvent: false });
        this.appointmentForm.get('visitDate')!.disable({ emitEvent: false });
        this.appointmentForm.get('visitTime')!.disable({ emitEvent: false }); 

        this.appointmentForm.get('visitPurpose')!.valueChanges.subscribe(() =>
        {
            this.appointmentForm.get('city')!.enable({ emitEvent: false });
            const currentCity = this.appointmentForm.get('city')!.value;

            this.appointmentForm.patchValue({ officeId: '', visitDate: '', visitTime: '' }, { emitEvent: false });
            this.offices = [];
            this.availableSlots = [];
            
            this.appointmentForm.get('officeId')!.disable({ emitEvent: false });
            this.appointmentForm.get('visitDate')!.disable({ emitEvent: false });
            this.appointmentForm.get('visitTime')!.disable({ emitEvent: false });

            if (currentCity) 
            {
                this.appointmentForm.get('officeId')!.enable({ emitEvent: false });
                this.loadOffices(currentCity);
            }
        });

        this.appointmentForm.get('city')!.valueChanges.subscribe(city =>
        {
            this.appointmentForm.patchValue({ officeId: '', visitDate: '', visitTime: '' }, { emitEvent: false });
            this.offices = [];
            this.availableSlots = [];
            
            this.appointmentForm.get('visitDate')!.disable({ emitEvent: false });
            this.appointmentForm.get('visitTime')!.disable({ emitEvent: false });
        
            if (city)
            {
                this.appointmentForm.get('officeId')!.enable({ emitEvent: false });
                this.loadOffices(city);
            }
            else 
            {
                this.appointmentForm.get('officeId')!.disable({ emitEvent: false });
            }
        });

        this.appointmentForm.get('officeId')!.valueChanges.subscribe(officeId =>
        {
            this.appointmentForm.patchValue({ visitDate: '', visitTime: '' }, { emitEvent: false });
            this.availableSlots = [];
            this.appointmentForm.get('visitTime')!.disable({ emitEvent: false });

            if (officeId) 
            {
                this.appointmentForm.get('visitDate')!.enable({ emitEvent: false });
            } 
            else 
            {
                this.appointmentForm.get('visitDate')!.disable({ emitEvent: false });
            }
        });

        this.appointmentForm.get('visitDate')!.valueChanges.subscribe(visitDate => 
        {
            this.appointmentForm.patchValue({ visitTime: '' }, { emitEvent: false });
            
            if (visitDate)
            {
                this.appointmentForm.get('visitTime')!.enable({ emitEvent: false }); 
                this.loadSlots();
            }
            else 
            {
                this.appointmentForm.get('visitTime')!.disable({ emitEvent: false }); 
            }
        });
    }
    
    private loadCities(): void
    {
        this.officeService.getCities().subscribe(
        {
            next: cities => this.cities = cities.sort(), 
            error: err => console.error(err)
        });
    }

    private loadOffices(city: string): void
    {
        const visitPurpose = this.appointmentForm.get('visitPurpose')!.value;
        const officeType = this.mapAppointmentPurposeToOfficeType(visitPurpose! as AppointmentPurpose);
            
        this.officeService.getOffices(city!, officeType).subscribe(
        {
            next: offices => this.offices = offices,
            error: err => console.error(err)
        });
    }

    private loadSlots(): void
    {
        const date = this.appointmentForm.get('visitDate')!.value;
        const officeId = this.appointmentForm.get('officeId')!.value;

        this.officeService.getAvailableSlots(Number(officeId), date!)
            .subscribe(
            {
                next: slots => this.availableSlots = slots,
                error: err => console.error(err)
            });
    }

    private mapAppointmentPurposeToOfficeType(ap: AppointmentPurpose): OfficeType | null
    {
        switch (ap)
        {
            case AppointmentPurpose.FirstVisit:
                return null;
            case AppointmentPurpose.Sample:
                return OfficeType.Collection;
            case AppointmentPurpose.Results:
                return null;
        }
    }


    onCancel()
    {
        this.cancel.emit();
    }

    onSubmit()
    {
        if (!this.appointmentForm.valid)
        {
            this.appointmentForm.markAllAsTouched();
            return;
        }

        const value = this.appointmentForm.getRawValue();

        this.appointmentService.createAppointment({
            patientId: this.patientId(),
            officeId: Number(value.officeId),
            visitDate: value.visitDate!,
            visitTime: value.visitTime!,
            purpose: value.visitPurpose as AppointmentPurpose
        }).subscribe(
        {
            next: () => this.confirm.emit(),
            error: err => 
            {
                console.error(err);
                this.errorMessage = err.error.msg;
            }
        });
    }
}
