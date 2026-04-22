import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Result } from '../../interfaces/result.interface';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { ResultStatus } from '@features/results/enums/result-status.enum';
import { ResultService } from '@features/results/services/result.service';
import { ResultParameter } from '@features/results/interfaces/result-parameter.interface';
import { UpdateResultParameter } from '@features/results/interfaces/update-result-parameter.interface';

@Component({
    selector: 'app-result-form',
    imports: [ModalComponent, ReactiveFormsModule],
    templateUrl: './result-form.component.html',
    styleUrl: './result-form.component.css'
})
export class ResultFormComponent implements OnInit
{
    private resultService = inject(ResultService);
    private fb = inject(FormBuilder);

    result = input.required<Result>();
    
    cancel = output<void>();
    confirm = output<void>();

    resultForm = this.fb.group({
        parameters: this.fb.array([])
    });

    errorText = '';

    ngOnInit(): void 
    {
        const result = this.result();
        this.resultService.getResultParameters(result.id)
            .subscribe(
            {
                next: parameters => 
                {
                    parameters.forEach(p =>
                    {
                        this.parameters.push(
                            this.fb.group({
                                id:      [p.id],
                                name:    [p.name],
                                unit:    [p.unit],
                                normMin: [p.normMin],
                                normMax: [p.normMax],
                                value:   [{ value: p.value, disabled: result.status !== ResultStatus.Pending }, Validators.required]
                            })
                        )
                    });
                },
                error: err => console.error(err)
            });
    }

    get title(): string
    {
        const result = this.result(); 
        if (result.status === ResultStatus.Pending)        
            return `Внести результати пацієнта ${result.patientLastName} ${result.patientFirstName}`;
        else
            return `Перегляд результатів пацієнта ${result.patientLastName} ${result.patientFirstName}`;
    }

    get cancelText(): string
    {
        if (this.result().status === ResultStatus.Pending)        
            return 'Скасувати';
        else
            return '';
        
    }

    get submitText(): string
    {
        if (this.result().status === ResultStatus.Pending)        
            return 'Зберегти';
        else
            return 'Ок';
        
    }

    get parameters(): FormArray
    {
        return this.resultForm.get('parameters') as FormArray;
    }

    normValueLabel(normMin: number, normMax: number, unit: string): string
    {
        if (normMin != null && normMax != null)
        {
            return `${normMin} - ${normMax} ${unit}`;
        }
        else if (normMin != null)
        {
            return `>${normMin} ${unit}`;
        }
        else if (normMax != null)
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
        const result = this.result();
        if (result.status !== ResultStatus.Pending)
        {
            this.cancel.emit();
            return;
            // export 
        } 
        
        if (!this.resultForm.valid)
        {
            this.errorText = 'Потрібно заповнити всі показники';
            return;
        }

        const formValues = this.parameters.getRawValue();

        const requestData = formValues.map((param: ResultParameter) => (
        {
            id: param.id,
            value: param.value
        } as UpdateResultParameter));

        this.resultService.updateResultParameters(requestData)
            .subscribe(
            {
                next: () => this.confirm.emit(),
                error: err => console.error(err)
            })
    }
}
