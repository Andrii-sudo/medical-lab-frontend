import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewAppointment } from '../../interfaces/appointment.interface';
import { AppointmentPurpose } from '../../enums/appointment-purpose.enum';
import { Office } from '@core/interfaces/office.interface';
import { offices } from '../dummy';
import { ModalComponent } from "@shared/components/modal/modal.component";
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-appointment-form',
    imports: [ReactiveFormsModule, ModalComponent],
    providers: [DatePipe],
    templateUrl: './appointment-form.component.html',
    styleUrl: './appointment-form.component.css'
})
export class AppointmentFormComponent implements OnInit
{
    @Input({ required: true }) patientId!: number;
    @Input({ required: true }) patientFirstName!: string;
    @Input({ required: true }) patientLastName!: string;
    
    @Output() cancel = new EventEmitter<void>();
    @Output() confirm = new EventEmitter<NewAppointment>();

    private fb = inject(FormBuilder);
    private dp = inject(DatePipe);

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
    filteredOffices: Office[] = [];
    availableSlots: string[] = [];
    private allOffices: Office[] = offices;

    ngOnInit(): void
    {
        this.cities = [...new Set(this.allOffices.map(o => o.city))].sort();
        
        this.appointmentForm.get('city')!.disable();
        this.appointmentForm.get('officeId')!.disable();
        this.appointmentForm.get('visitDate')!.disable();
        this.appointmentForm.get('visitTime')!.disable();   

        this.appointmentForm.get('visitPurpose')!.valueChanges.subscribe(() =>
        {
            this.appointmentForm.get('city')!.enable();
            this.appointmentForm.patchValue({ city: '', officeId: '', visitDate: '', visitTime: '' });
            this.filteredOffices = [];
            this.availableSlots = [];
            this.appointmentForm.get('officeId')!.disable();
            this.appointmentForm.get('visitDate')!.disable();
            this.appointmentForm.get('visitTime')!.disable();
        });

        this.appointmentForm.get('city')!.valueChanges.subscribe(city =>
        {
            this.filteredOffices = this.allOffices.filter(o => o.city === city);
            this.appointmentForm.get('officeId')!.enable();
            this.appointmentForm.patchValue({ officeId: '', visitDate: '', visitTime: '' });
            this.availableSlots = [];
            this.appointmentForm.get('visitDate')!.disable();
            this.appointmentForm.get('visitTime')!.disable();
        });

        this.appointmentForm.get('officeId')!.valueChanges.subscribe(() =>
        {
            this.appointmentForm.get('visitDate')!.enable();
            this.appointmentForm.patchValue({ visitDate: '', visitTime: '' });
            this.availableSlots = [];
            this.appointmentForm.get('visitTime')!.disable();
        });

        this.appointmentForm.get('visitDate')!.valueChanges.subscribe(() => 
        {
            this.appointmentForm.get('visitTime')!.enable(); 
            this.updateSlots();
        });
    }
    
    private updateSlots(): void
    {
        const date = this.appointmentForm.get('visitDate')!.value;
        const office = this.appointmentForm.get('officeId')!.value;

        this.availableSlots = [];
        this.appointmentForm.patchValue({ visitTime: '' });

        if (!date || !office) return;

        for (let h = 9; h < 18; h++)
        {
            this.availableSlots.push(`${String(h).padStart(2, '0')}:00`);
            this.availableSlots.push(`${String(h).padStart(2, '0')}:30`);
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
        this.confirm.emit({
            patientId: this.patientId,
            officeId: Number(value.officeId),
            visitTime: new Date(`${value.visitDate}T${value.visitTime}`),
            purpose: Number(value.visitPurpose) as AppointmentPurpose
        });
    }
}
