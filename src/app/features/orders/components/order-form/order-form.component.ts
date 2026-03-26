import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientLookup } from '../../interfaces/patient-lookup.interface';
import { DatePipe } from '@angular/common';
import { Analysis } from '../../interfaces/analysis';
import { ModalComponent } from "@shared/components/modal/modal.component";
@Component({
    selector: 'app-order-form',
    imports: [ReactiveFormsModule, DatePipe, ModalComponent],
    templateUrl: './order-form.component.html',
    styleUrl: './order-form.component.css'
})
export class OrderFormComponent 
{
    @Output() cancel = new EventEmitter<void>();
    @Output() confirm = new EventEmitter<void>();

    orderForm: FormGroup;
    filteredPatients: PatientLookup[] = [];
    
    filteredAnalyses: Analysis[] = [];
    selectedAnalyses: Analysis[] = [];


    constructor(private fb: FormBuilder)
    {
        this.orderForm = this.fb.group({
            patientId: ['', Validators.required],
            patientName: [''],
            analysisSearch: ['']
        });
    }

    onSearchChange(event: any): void 
    {
        this.orderForm.patchValue({ patientId: '' });

        const query = event.target.value.toLowerCase();
        if (query.length < 2) 
        {
            this.filteredPatients = [];
            return;
        }

        const mockPatients: PatientLookup[] = 
        [
            { id: 1, lastName: 'Коваленко', firstName: 'Олександр', middleName: 'Сергійович', birthDate: new Date('1985-05-20') },
            { id: 2, lastName: 'Петренко', firstName: 'Марія', birthDate: new Date('1990-10-12') }
        ];

        this.filteredPatients = mockPatients.filter(p => 
            p.lastName.toLowerCase().includes(query)
        );
    }

    selectPatient(patient: PatientLookup)
    {
        const name = `${patient.lastName} ${patient.firstName}${patient.middleName ? ' ' + patient.middleName : ''}`;
        this.orderForm.patchValue({ patientId: patient.id, patientName: name });
        this.filteredPatients = [];
    }

    onAnalysisSearchChange(event: any): void
    {
        const query = (event.target.value as string).toLowerCase();
        if (query.length < 2)
        {
            this.filteredAnalyses = [];
            return;
        }

        const mockAnalyses: Analysis[] = 
        [
            { id: 1, name: 'Загальний аналіз крові',     price: 120 },
            { id: 2, name: 'Біохімічний аналіз крові',    price: 280 },
            { id: 3, name: 'Загальний аналіз сечі',       price: 90  },
            { id: 4, name: 'Глюкоза крові',               price: 80  },
            { id: 5, name: 'ТТГ (тиреотропний гормон)',   price: 220 }
        ];

        this.filteredAnalyses = mockAnalyses.filter(a =>
            a.name.toLowerCase().includes(query) &&
            !this.selectedAnalyses.some(s => s.id === a.id) // не показувати вже обрані
        );
    }

    selectAnalysis(analysis: Analysis): void
    {
        this.selectedAnalyses.push(analysis);
        this.filteredAnalyses = [];
        this.orderForm.patchValue({ analysisSearch: '' }); // очищаємо поле
    }

    removeAnalysis(id: number): void
    {
        this.selectedAnalyses = this.selectedAnalyses.filter(a => a.id !== id);
    }

    onCancel(): void
    {
        this.cancel.emit();
    }

    onSubmit(): void
    {
        if (!this.orderForm.valid)
        {
            this.orderForm.markAllAsTouched();
        }
        else
        {
            // ХЗ
            this.confirm.emit();
        }
    }
}
