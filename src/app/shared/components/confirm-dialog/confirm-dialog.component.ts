import { Component, EventEmitter } from '@angular/core';
import { Input, Output } from '@angular/core';

@Component({
    selector: 'app-confirm-dialog',
    imports: [],
    templateUrl: './confirm-dialog.component.html',
    styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent 
{
    @Input({ required: true }) title!: string;
    @Input({ required: true }) description!: string;
    @Input() cancelText: string = 'Ні';
    @Input() confirmText: string = 'Так';

    @Output() cancel = new EventEmitter();
    @Output() confirm = new EventEmitter();

    onDialogCancel(): void
    {
        this.cancel.emit();
    }

    onDialogConfirm(): void
    {
        this.confirm.emit();
    }
}
