import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-modal',
    imports: [],
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.css'
})
export class ModalComponent 
{
    @Input({ required: true }) formId!: string;
    @Input({ required: true }) title!: string;
    @Input({ required: true }) submitText!: string;
    @Input() cancelText: string = 'Скасувати';
    @Input() errorText: string = '';
    @Input() width: string = '35rem';

    @Output() cancel = new EventEmitter<void>();

    onCancelClick(): void
    {
        this.cancel.emit();
    }
}
