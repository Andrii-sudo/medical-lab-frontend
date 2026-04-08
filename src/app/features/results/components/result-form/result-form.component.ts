import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Result } from '../../interfaces/result.interface';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { ResultStatus } from '@features/results/enums/result-status.enum';

@Component({
    selector: 'app-result-form',
    imports: [ModalComponent, ReactiveFormsModule],
    templateUrl: './result-form.component.html',
    styleUrl: './result-form.component.css'
})
export class ResultFormComponent implements OnInit
{
    @Input({ required: true }) result!: Result;
    
    @Output() cancel = new EventEmitter<void>();
    @Output() confirm = new EventEmitter<Result>();

    private fb = inject(FormBuilder);

    resultForm = this.fb.group({
        parameters: this.fb.array([])
    });;
    showError = false;

    ngOnInit(): void 
    {
        this.result.parameters.forEach(p =>
        {
            this.parameters.push(
                this.fb.group({
                    id:      [p.id],
                    name:    [p.name],
                    unit:    [p.unit],
                    normMin: [p.normMin],
                    normMax: [p.normMax],
                    value:   [{ value: p.value, disabled: this.result.status !== ResultStatus.Pending }, Validators.required]
                })
            )
        });
    }

    get title(): string
    {
        if (this.result.status === ResultStatus.Pending)        
            return 'Внести результати';
        else
            return 'Перегляд результатів';
    }

    get cancelText(): string
    {
        if (this.result.status === ResultStatus.Pending)        
            return 'Скасувати';
        else
            return '';
        
    }

    get submitText(): string
    {
        if (this.result.status === ResultStatus.Pending)        
            return 'Зберегти';
        else
            return 'Ок';
        
    }

    get errorText(): string
    {
        if (this.showError)
            return 'Потрібно заповнити всі показники';
        else
            return '';
    }

    get parameters(): FormArray
    {
        return this.resultForm.get('parameters') as FormArray;
    }

    normValueLabel(normMin: number, normMax: number, unit: string): string
    {
        if (normMin && normMax)
        {
            return `${normMin} - ${normMax} ${unit}`;
        }
        else if (normMin)
        {
            return `>${normMin} ${unit}`;
        }
        else if (normMax)
        {
            return `<${normMax} ${unit}`;
        }

        return '';
    }

    onCancel()
    {
        this.cancel.emit();
    }

    onSubmit()
    {
        // if (this.result.status) ... 
        
        if (!this.resultForm.valid)
        {
            this.showError = true;
            return;
        }

        // .controls - це масив FormGroup-ів
        // .map(c => c.value) - витягує { id, name, unit, normMin, normMax, value } з кожного
        const params = this.parameters.controls.map(c => c.value);

        // перевіряємо чи хоч один параметр виходить за межі норми
        const hasAbnormal = params.some(p =>
            (p.normMin != null && p.value < p.normMin) ||
            (p.normMax != null && p.value > p.normMax)
        );

        // ...this.result - копіюємо всі поля result (id, patientFirstName, ...)
        // і перезаписуємо status та parameters новими значеннями
        this.confirm.emit({
            ...this.result,
            status: hasAbnormal ? ResultStatus.Abnormal : ResultStatus.Normal,
            parameters: params
        });
    }
}
