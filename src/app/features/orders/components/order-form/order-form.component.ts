import { Component, inject, input, OnDestroy, OnInit, output, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Patient } from '../../interfaces/patient.interface';
import { Analysis } from '../../interfaces/analysis.interface';
import { ModalComponent } from "@shared/components/modal/modal.component";
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { OrderFormService } from '@features/orders/services/order-form.service';
import { SelectedOfficeService } from '@core/services/selected-office.service';
import { NewOrder } from '@features/orders/interfaces/new-order.interface';

@Component({
    selector: 'app-order-form',
    imports: [ReactiveFormsModule, ModalComponent],
    templateUrl: './order-form.component.html',
    styleUrl: './order-form.component.css'
})
export class OrderFormComponent implements OnInit, OnDestroy
{
    private orderFormService = inject(OrderFormService);
    private selcOfficeService = inject(SelectedOfficeService)
    private fb = inject(FormBuilder);
    
    initialPatient = input<Patient>();

    cancel = output<void>();
    confirm = output<void>();

    orderForm = this.fb.group({
        patientId: this.fb.control<number | null>(null, Validators.required),
        patientName: [''],
        analysisSearch: ['']
    });
    errorText = '';

    patientSearchTerm = '';
    analysisSearchTerm = '';
    dropDownCount = 4;

    patients: Patient[] = [];
    
    analyses: Analysis[] = [];
    selectedAnalyses: Analysis[] = [];

    private patientSubject = new Subject<string>();
    private patientSub!: Subscription;

    private analysisSubject = new Subject<string>();
    private analysisSub!: Subscription;

    ngOnInit()
    {
        const patient = this.initialPatient();
        if (patient)
        {
            const name = `${patient.lastName} ${patient.firstName}` +
                         `${patient.middleName ? ' '+ patient.middleName : ''}`;
            this.orderForm.patchValue({
                patientId: patient.id,
                patientName: name 
            });
        }

        this.patientSub = this.patientSubject.pipe(
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe(term => 
        {
            if (term)
            {
                this.patientSearchTerm = term;
                this.getPatients();
            }
        });

        this.analysisSub = this.analysisSubject.pipe(
            debounceTime(500),
            distinctUntilChanged()
            ).subscribe(term => 
        {
            if (term)
            {
                this.analysisSearchTerm = term;
                this.getAnalyses();
            }
        });
    }

    ngOnDestroy(): void 
    {
        this.patientSub.unsubscribe();
        this.analysisSub.unsubscribe();
    }

    onPatientSearchChange(e: Event): void
    {
        const target = e.target as HTMLInputElement;
        const value = target.value.trim();

        if (value.length !== 1)
        {
            this.patientSubject.next(value);
        }
    }

    onAnalysisSearchChange(e: Event): void
    {
        const target = e.target as HTMLInputElement;
        const value = target.value.trim();

        if (value.length !== 1)
        {
            this.analysisSubject.next(value);
        }
    }

    selectPatient(patient: Patient)
    {
        const name = `${patient.lastName} ${patient.firstName}${patient.middleName ? ' ' + patient.middleName : ''}`;
        this.orderForm.patchValue({ patientId: patient.id, patientName: name });
        this.patients = [];
    }

    getPatients()
    {   
        this.orderFormService
            .getPatients(this.patientSearchTerm, this.dropDownCount)
            .subscribe(
            {
                next: patients => this.patients = patients,
                error: err => console.error(err)
            });
    }

    getAnalyses()
    {   
        this.orderFormService
            .getAnalyses(this.analysisSearchTerm, this.dropDownCount)
            .subscribe(
            {
                next: analyses => 
                {
                    this.analyses = analyses.filter(a =>
                        !this.selectedAnalyses.some(s => s.id === a.id));
                },
                error: err => console.error(err)
            });
    }

    selectAnalysis(analysis: Analysis): void
    {
        this.selectedAnalyses.push(analysis);
        this.analyses = [];
        this.orderForm.patchValue({ analysisSearch: '' });
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

        const office = this.selcOfficeService.selectedOffice();
        if (!office)
        {
            this.errorText = 'Ви не прикріплені до жодного відділення';
            return;
        }

        const newOrder: NewOrder = 
        {
            patientId: this.orderForm.value.patientId as number,
            officeId: office.id, 
            analysisIds: this.selectedAnalyses.map(analysis => analysis.id)
        };

        this.orderFormService.createOrder(newOrder)
            .subscribe(
            {
                next: () => this.confirm.emit(),
                error: err =>
                {
                    this.errorText = err.error.msg;
                    console.error(err);
                }    
            }); 
    }
}
