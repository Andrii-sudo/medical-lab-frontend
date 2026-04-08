import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientLookup } from '../../interfaces/patient-lookup.interface';
import { Analysis } from '../../interfaces/analysis.interface';
import { ModalComponent } from "@shared/components/modal/modal.component";

@Component({
    selector: 'app-order-form',
    imports: [ReactiveFormsModule, ModalComponent],
    templateUrl: './order-form.component.html',
    styleUrl: './order-form.component.css'
})
export class OrderFormComponent implements OnInit
{
    @Input() initialPatient?: PatientLookup;

    @Output() cancel = new EventEmitter<void>();
    @Output() confirm = new EventEmitter<void>();

    private fb = inject(FormBuilder);
    
    orderForm = this.fb.group({
        patientId: this.fb.control<number | null>(null, Validators.required),
        patientName: [''],
        analysisSearch: ['']
    });

    filteredPatients: PatientLookup[] = [];
    
    filteredAnalyses: Analysis[] = [];
    selectedAnalyses: Analysis[] = [];

    ngOnInit()
    {
        if (this.initialPatient)
        {
            const name = `${this.initialPatient.lastName} ${this.initialPatient.firstName}` +
                         `${this.initialPatient.middleName ? ' '+ this.initialPatient.middleName : ''}`;
            this.orderForm.patchValue({
                patientId: this.initialPatient.id,
                patientName: name 
            });
        }
    }

    onSearchChange(e: Event): void 
    {
        this.orderForm.patchValue({ patientId: null });

        const query = (e.target as HTMLInputElement).value.toLowerCase();
        if (query.length < 2) 
        {
            this.filteredPatients = [];
            return;
        }

        const mockPatients: PatientLookup[] = 
        [
            { id: 1, lastName: 'Коваленко', firstName: 'Олександр', middleName: 'Сергійович', phone: '+380679876543', },
            { id: 2, lastName: 'Петренко', firstName: 'Марія', phone: '+380501234567' }
        ];

        this.filteredPatients = mockPatients.filter(p => 
            p.lastName.toLowerCase().includes(query) ||
            p.phone.includes(query)
        );
    }

    selectPatient(patient: PatientLookup)
    {
        const name = `${patient.lastName} ${patient.firstName}${patient.middleName ? ' ' + patient.middleName : ''}`;
        this.orderForm.patchValue({ patientId: patient.id, patientName: name });
        this.filteredPatients = [];
    }

    onAnalysisSearchChange(e: Event): void
    {
        const query = (e.target as HTMLInputElement).value.toLowerCase();
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
        if (!this.orderForm.valid || this.selectedAnalyses.length === 0)
        {
            this.orderForm.markAllAsTouched();
            return;
        }
    
        console.log(this.orderForm.value);
        // ХЗ
        this.confirm.emit();    
    }
}
