import { Component, inject, input, OnInit, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Patient } from '../../interfaces/patient.interface';
import { ModalComponent } from "@shared/components/modal/modal.component";
import { DatePipe } from '@angular/common';
import { PatientService } from '@features/patients/services/patient.service';
import { NewPatient } from '@features/patients/interfaces/new-patient.interface';

@Component({
    selector: 'app-patient-form',
    imports: [ReactiveFormsModule, ModalComponent],
    providers: [DatePipe],
    templateUrl: './patient-form.component.html',
    styleUrl: './patient-form.component.css'
})
export class PatientFormComponent implements OnInit
{
    private patientService = inject(PatientService); 
    private fb = inject(FormBuilder);
    private dp = inject(DatePipe);

    patient = input<Patient>();

    cancel = output<void>();
    confirm = output<void>();

    patientForm!: FormGroup;
    today!: string;

    errorMessage: string = '';

    ngOnInit(): void 
    {
        this.patientForm = this.fb.group({
            id:         [this.patient()?.id],
            firstName:  [this.patient()?.firstName ?? '', Validators.required],
            lastName:   [this.patient()?.lastName ?? '', Validators.required],
            middleName: [this.patient()?.middleName ?? null],
            birthDate:  [this.formatDate(this.patient()?.birthDate), Validators.required],
            gender:     [this.patient()?.gender ?? '', Validators.required],
            phone:      [this.patient()?.phone ?? null, [Validators.required, Validators.pattern(/^\+?[\d\s\-()]{7,18}$/)]],
            email:      [this.patient()?.email ?? null, Validators.email]
        });
        this.today = this.formatDate(new Date());
    }

    private formatDate(date?: Date | string): string
    {
        if (!date) return '';
        return this.dp.transform(date, 'yyyy-MM-dd') ?? '';
    }

    onCancel(): void
    {
        this.cancel.emit();
    }

    onSubmit(): void
    {
        if (!this.patientForm.valid)
        {
            this.patientForm.markAllAsTouched();
            return;
        }
         
        if (!this.patient())
        {
            this.patientService.createPatient(this.patientForm.value as NewPatient)
                .subscribe(
                {
                    next: () => this.confirm.emit(), 
                    error: err => 
                    {
                        console.error(err);
                        this.errorMessage = err.error.msg;
                    }
                });
        }
        else
        {
            // edit
            this.patientService.updatePatient(this.patientForm.value as Patient)
                .subscribe(
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
}
