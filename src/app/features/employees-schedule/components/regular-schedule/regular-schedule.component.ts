import { SlicePipe } from '@angular/common';
import { Component, effect, inject, input, OnInit } from '@angular/core';
import { RegularShift } from '@features/employees-schedule/interfaces/regular-shift.interface';
import { Shift } from '@features/employees-schedule/interfaces/shift.interface';
import { EmployeeScheduleService } from '@features/employees-schedule/services/employee-schedule.service';
import { Employee } from '@features/employees/interfaces/employee.interface';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { RegularShiftModalComponent } from '../regular-shift-modal/regular-shift-modal.component';

@Component({
    selector: 'app-regular-schedule',
    imports: [SlicePipe, ConfirmDialogComponent, RegularShiftModalComponent],
    templateUrl: './regular-schedule.component.html',
    styleUrl: './regular-schedule.component.css'
})
export class RegularScheduleComponent 
{
    private employeeScheduleService = inject(EmployeeScheduleService);

    selectedEmployee = input<Employee | null>(); 

    regularSchedule: (RegularShift | null)[] = [];

    // Точно як у employees.component.ts:
    selectedShift: RegularShift | null = null;
    selectedDayOfWeek: number = 0;

    showAddShiftForm = false;
    showEditShiftForm = false;
    
    showDeleteDialog = false;
    dialogDescription = '';

    constructor() 
    {
        effect(() => 
        {
            const employee = this.selectedEmployee();
            if (employee)
            {
                this.loadShifts();
            }
        });
    }

    getDayOfWeekLabel(dayOfWeek: number): string
    {
        switch(dayOfWeek)
        {
            case 0: return 'Нд';
            case 1: return 'Пн';
            case 2: return 'Вт';
            case 3: return 'Ср';
            case 4: return 'Чт';
            case 5: return 'Пт';
            case 6: return 'Сб';    
            default: return '-';
        }
    }

    onAddShiftClick(dayOfWeek: number): void
    {
        this.selectedDayOfWeek = dayOfWeek;
        this.showAddShiftForm = true;
    }

    onEditShiftClick(s: RegularShift): void
    {
        this.selectedShift = s;
        this.selectedDayOfWeek = s.dayOfWeek;
        this.showEditShiftForm = true;
    }

    onDeleteShiftClick(s: RegularShift): void
    {
        this.selectedShift = s;
        const employee = `${this.selectedEmployee()!.lastName} ${this.selectedEmployee()!.firstName}`;
        const shift = `'${this.getDayOfWeekLabel(s.dayOfWeek)}, ${s.startTime.slice(0, 5)}-${s.endTime.slice(0, 5)}'`;
        this.dialogDescription = `Видалити зміну працівника ${employee} ${shift}?`;
        this.showDeleteDialog = true;
    }

    onAddShift(): void
    {
        this.showAddShiftForm = false;
        this.loadShifts();
    }

    onEditShift(): void
    {
        this.showEditShiftForm = false;
        this.loadShifts();
    }

    deleteShift(): void
    {
        if (this.selectedShift)
        {
            this.employeeScheduleService.deleteRegularShift(this.selectedShift.id)
                .subscribe(
                {
                    next: () =>  
                    {
                        this.showDeleteDialog = false;
                        this.loadShifts();
                    },
                    error: err => console.error(err)
                });
        }
    }

    private loadShifts(): void
    {
        this.employeeScheduleService.getRegularSchedule(this.selectedEmployee()!.id)
            .subscribe(
            {
                next: schedule => { this.regularSchedule = schedule; },
                error: err => console.error(err)
            });
    }
}