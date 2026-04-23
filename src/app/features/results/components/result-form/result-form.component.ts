import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Result } from '../../interfaces/result.interface';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { ResultStatus } from '@features/results/enums/result-status.enum';
import { ResultService } from '@features/results/services/result.service';
import { UpdateResultParameter } from '@features/results/interfaces/update-result-parameter.interface';
import { UpdateResult } from '@features/results/interfaces/update-result.interface';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any)['vfs'] = (pdfFonts as any)['vfs'];

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
        return 'Скасувати';
        
    }

    get submitText(): string
    {
        return this.isEditable ? 'Зберегти' : 'Експортувати';
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
            this.exportToPdf();
            this.cancel.emit();
            return; 
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

    exportToPdf(): void
    {
        const result = this.result();
        const params = this.parameters.getRawValue();
        const conclusion = this.resultForm.getRawValue().conclusion;
        const date = new Date().toLocaleDateString('uk-UA');

        const paramRows = params.map((p: any) =>
        {
            const norm = this.normValueLabel(p.normMin, p.normMax, p.unit);
            const value = p.value ?? '—';
            
            let valueColor = '#1a1a1a';
            if (p.value != null && p.normMin != null && p.value < p.normMin) valueColor = '#c0392b';
            if (p.value != null && p.normMax != null && p.value > p.normMax) valueColor = '#c0392b';

            return [
                { text: p.name, style: 'paramName' },
                { text: String(value), style: 'paramValue', color: valueColor, bold: valueColor !== '#1a1a1a' },
                { text: p.unit || '—', style: 'paramCell' },
                { text: norm || '—', style: 'paramCell' }
            ];
        });

        const docDefinition: any = 
        {
            pageSize: 'A4',
            pageMargins: [40, 50, 40, 60],
            defaultStyle: { font: 'Roboto' },

            footer: (currentPage: number, pageCount: number) => (
            {
                columns: 
                [
                    { text: `Документ згенеровано: ${date}`, style: 'footer', alignment: 'left' },
                    { text: `Сторінка ${currentPage} з ${pageCount}`, style: 'footer', alignment: 'right' }
                ],
                margin: [40, 10]
            }),

            content: 
            [
                {
                    columns: 
                    [
                        {
                            stack: 
                            [
                                { text: 'MedLab', style: 'labName' },
                                { text: 'Медична лабораторія', style: 'labSubtitle' },
                            ]
                        },
                        {
                            stack: 
                            [
                                { text: 'РЕЗУЛЬТАТИ ДОСЛІДЖЕННЯ', style: 'docTitle', alignment: 'right' },
                                { text: `Замовлення №${result.orderNumber}`, style: 'orderNum', alignment: 'right' },
                                { text: `Дата: ${date}`, style: 'dateText', alignment: 'right' }
                            ]
                        }
                    ]
                },

                { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 2, lineColor: '#2980b9' }], margin: [0, 10, 0, 12] },

                {
                    table: 
                    {
                        widths: ['*', '*'],
                        body: 
                        [
                            [
                                {
                                    stack: 
                                    [
                                        { text: 'ПАЦІЄНТ', style: 'sectionLabel' },
                                        { text: `${result.patientLastName} ${result.patientFirstName}`, style: 'patientName' },
                                        { text: `Тел.: ${result.patientPhone}`, style: 'patientDetail' }
                                    ],
                                    border: [false, false, false, false]
                                },
                                {
                                    stack: 
                                    [
                                        { text: 'ТИП ЗРАЗКА', style: 'sectionLabel' },
                                        { text: result.sampleType || '—', style: 'patientDetail' }
                                    ],
                                    border: [false, false, false, false],
                                    alignment: 'right'
                                }
                            ]
                        ]
                    },
                    margin: [0, 0, 0, 14]
                },

                { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#bdc3c7' }], margin: [0, 0, 0, 14] },

                { text: 'ПОКАЗНИКИ', style: 'sectionLabel', margin: [0, 0, 0, 6] },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', 80, 60, 120],
                        body: 
                        [
                            [
                                { text: 'Показник',        style: 'tableHeader' },
                                { text: 'Значення',         style: 'tableHeader', alignment: 'center' },
                                { text: 'Одиниці',          style: 'tableHeader', alignment: 'center' },
                                { text: 'Референтний діапазон', style: 'tableHeader', alignment: 'center' }
                            ],
                            ...paramRows.map((row: any, i: number) =>
                                row.map((cell: any) => (
                                {
                                    ...cell,
                                    fillColor: i % 2 === 0 ? '#f8fafc' : '#ffffff'
                                }))
                            )
                        ]
                    },
                    layout: 
                    {
                        hLineWidth: (i: number) => i === 0 || i === 1 ? 1 : 0.5,
                        vLineWidth: () => 0.5,
                        hLineColor: () => '#dde1e7',
                        vLineColor: () => '#dde1e7',
                        paddingTop: () => 6,
                        paddingBottom: () => 6,
                        paddingLeft: () => 8,
                        paddingRight: () => 8
                    }
                },

                ...(conclusion?.trim() ? 
                [
                    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#bdc3c7' }], margin: [0, 16, 0, 12] },
                    { text: 'ВИСНОВОК', style: 'sectionLabel', margin: [0, 0, 0, 6] },
                    {
                        table: 
                        {
                            widths: ['*'],
                            body: [[{ text: conclusion, style: 'conclusionText', border: [false, false, false, false] }]]
                        },
                        fillColor: '#f0f4f8',
                        margin: [0, 0, 0, 0]
                    }
                ] : [])
            ],

            styles: 
            {
                labName:        { fontSize: 18, bold: true, color: '#2980b9' },
                labSubtitle:    { fontSize: 9, color: '#7f8c8d', margin: [0, 2, 0, 0] },
                docTitle:       { fontSize: 13, bold: true, color: '#2c3e50' },
                orderNum:       { fontSize: 10, color: '#2980b9', margin: [0, 3, 0, 0] },
                dateText:       { fontSize: 9, color: '#7f8c8d', margin: [0, 2, 0, 0] },
                sectionLabel:   { fontSize: 8, bold: true, color: '#7f8c8d', letterSpacing: 1 },
                patientName:    { fontSize: 13, bold: true, color: '#2c3e50', margin: [0, 3, 0, 2] },
                patientDetail:  { fontSize: 10, color: '#555', margin: [0, 1, 0, 0] },
                tableHeader:    { fontSize: 9, bold: true, color: '#2c3e50', fillColor: '#2980b9', },
                paramName:      { fontSize: 10, color: '#2c3e50' },
                paramValue:     { fontSize: 10, alignment: 'center' },
                paramCell:      { fontSize: 10, color: '#555', alignment: 'center' },
                conclusionText: { fontSize: 10, color: '#2c3e50', lineHeight: 1.5 },
                legend:         { fontSize: 8, color: '#c0392b', italics: true },
                footer:         { fontSize: 8, color: '#aaa' }
            }
        };

        pdfMake.createPdf(docDefinition).download(
            `Результат_${result.patientLastName}_${result.orderNumber}.pdf`
        );
    }
}
