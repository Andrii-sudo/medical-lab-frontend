import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Patient } from '../../interfaces/patient.interface';
import { ModalComponent } from "@shared/components/modal/modal.component";
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-patient-form',
    imports: [ReactiveFormsModule, ModalComponent],
    providers: [DatePipe],
    templateUrl: './patient-form.component.html',
    styleUrl: './patient-form.component.css'
})
export class PatientFormComponent implements OnInit
{
    @Input() patient?: Patient;

    @Output() cancel = new EventEmitter<void>();
    @Output() confirm = new EventEmitter<Patient>();

    private fb = inject(FormBuilder);
    private dp = inject(DatePipe);

    patientForm!: FormGroup;
    today!: string;

    ngOnInit(): void 
    {
        this.patientForm = this.fb.group({
            firstName:  [this.patient?.firstName ?? '', Validators.required],
            lastName:   [this.patient?.lastName ?? '', Validators.required],
            middleName: [this.patient?.middleName ?? null],
            birthDate:  [this.formatDate(this.patient?.birthDate), Validators.required],
            gender:     [this.patient?.gender ?? '', Validators.required],
            phone:      [this.patient?.phone ?? null, [Validators.required, Validators.pattern(/^\+?[\d\s\-()]{7,18}$/)]],
            email:      [this.patient?.email ?? null, Validators.email]
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
         
        // Add / edit logic...
        const value = {
            ...this.patientForm.value,
            id: -1
        };

        this.confirm.emit(value as Patient);
    }
}
