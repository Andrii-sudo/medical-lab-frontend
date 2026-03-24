import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Patient } from '../../interfaces/patient.interface';

function atLeastOneContact(group: AbstractControl): ValidationErrors | null 
{
    const phone = group.get('phone')?.value;
    const email = group.get('email')?.value;
    return phone || email ? null : { contactRequired: true };
}

@Component({
    selector: 'app-patient-form',
    imports: [ReactiveFormsModule],
    templateUrl: './patient-form.component.html',
    styleUrl: './patient-form.component.css'
})
export class PatientFormComponent 
{
    @Output() cancel = new EventEmitter<void>();
    @Output() confirm = new EventEmitter<Patient>();
    
    patientForm: FormGroup;
    patientError = false;
    today = new Date().toISOString().split('T')[0];
    
    constructor(private fb: FormBuilder)
    {
        this.patientForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            middleName: [null],
            birthDate: ['', Validators.required],
            gender: ['', Validators.required],
            phone: [null, Validators.pattern(/^\+?[\d\s\-()]{7,15}$/)],
            email: [null, Validators.email]
        }, { validators: atLeastOneContact});
    }

    onCancelClick(): void
    {
        this.cancel.emit();
    }

    onSubmit(): void
    {
        if (!this.patientForm.valid)
        {
            this.patientForm.markAllAsTouched();
        }
        else
        {
            const value = {
                ...this.patientForm.value,
                id: -1
            };

            this.confirm.emit(value as Patient);
        }
    }
}
