import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Result } from '../../interfaces/result.interface';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { ResultStatus } from '@features/results/enums/result-status.enum';
import { ResultService } from '@features/results/services/result.service';
import { ResultParameter } from '@features/results/interfaces/result-parameter.interface';
import { UpdateResultParameter } from '@features/results/interfaces/update-result-parameter.interface';
import { UpdateResult } from '@features/results/interfaces/update-result.interface';

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
    editMode = input.required<boolean>();

    cancel = output<void>();
    confirm = output<void>();

    resultForm = this.fb.group({
        parameters: this.fb.array([]),
        conclusion: ['']
    });

    errorText = '';

    ngOnInit(): void 
    {
        const result = this.result();
        this.resultService.getResultInfo(result.id)
            .subscribe(
            {
                next: info => 
                {
                    this.resultForm.patchValue({ conclusion: info.conclusion || '' });
                    if (!this.isEditable)
                    {
                        this.resultForm.get('conclusion')?.disable();
                    }

                    info.parameters.forEach(p =>
                    {
                        this.parameters.push(
                            this.fb.group({
                                id:      [p.id],
                                name:    [p.name],
                                unit:    [p.unit],
                                normMin: [p.normMin],
                                normMax: [p.normMax],
                                value:   [{ value: p.value, disabled: !this.isEditable }, Validators.required]
                            })
                        )
                    });
                },
                error: err => console.error(err)
            });
    }

    get isEditable(): boolean 
    {
        return this.result().status === ResultStatus.Pending || this.editMode();
    }

    get showConclusionBlock(): boolean 
    {
        if (this.isEditable) return true;

        const text = this.resultForm.get('conclusion')?.value;
        return !!text && text.trim().length > 0;
    }

    get title(): string
    {
        const result = this.result(); 
        const patient = `${result.patientLastName} ${result.patientFirstName}`;
        if (result.status === ResultStatus.Pending)        
        {
            return `Внести результати пацієнта ${patient}`;
        }
        else if (this.editMode())
        {
            return `Редагування результатів пацієнта ${patient}`;
        }
        else
        {
            return `Перегляд результатів пацієнта ${patient}`;
        }
    }

    get cancelText(): string
    {
        return this.isEditable ? 'Скасувати' : '';
        
    }

    get submitText(): string
    {
        return this.isEditable ? 'Зберегти' : 'Ок';
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
        if (!this.isEditable)
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
        const conclusionValue = this.resultForm.getRawValue().conclusion;
        
        const requestData: UpdateResult = 
        {
            id: result.id,
            conclusion: conclusionValue || null,
            parameters: formValues.map((param: any) => (
            {
                id: param.id,
                value: param.value
            } as UpdateResultParameter))
        };

        this.resultService.updateResultInfo(requestData)
            .subscribe(
            {
                next: () => this.confirm.emit(),
                error: err => console.error(err)
            })
    }
}
