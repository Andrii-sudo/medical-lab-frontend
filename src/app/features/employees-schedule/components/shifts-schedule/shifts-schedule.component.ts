import { SlicePipe } from '@angular/common';
import { Component, effect, inject, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ShiftType } from '@features/employees-schedule/enums/shift-type.enum';
import { Shift } from '@features/employees-schedule/interfaces/shift.interface';
import { EmployeeScheduleService } from '@features/employees-schedule/services/employee-schedule.service';
import { Employee } from '@features/employees/interfaces/employee.interface';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';

@Component({
    selector: 'app-shifts-schedule',
    imports: [PaginationComponent, ConfirmDialogComponent, FormsModule, SlicePipe],
    templateUrl: './shifts-schedule.component.html',
    styleUrl: './shifts-schedule.component.css'
})
export class ShiftsScheduleComponent //implements OnInit
{
    private employeeScheduleService = inject(EmployeeScheduleService);

    selectedEmployee = input<Employee | null>(); 

    selectedShift: Shift | null = null;
    showDeleteDialog = false;
    dialogDescription = '';

    hidePast = false;

    shifts: Shift[] = [];

    selectedPage = 1;
    pageCount = 1;
    pageSize = 6;

    constructor() 
    {
        effect(() => 
        {
            if (this.selectedEmployee())
            {
                this.loadPage(1);
            }   
        });
    }

    getShiftTypeLabel(st: ShiftType): string
    {
        switch (st)
        {
            case ShiftType.Work:
                return 'Додаткова робота';
            case ShiftType.DayOff:
                return 'Вихідний';
            case ShiftType.Vacation:
                return 'Відпустка';
            case ShiftType.SickLeave:
                return 'Лікарняний';
        }
    }

    onHidePastChange(): void
    {
        this.loadPage(1);
    }

    onDeleteClick(s: Shift): void
    {
        this.selectedShift = s;
        this.dialogDescription = `Видалити виняток від ${s.startDate}?`;
        this.showDeleteDialog = true;
    }

    deleteShift(): void
    {
        if (!this.selectedShift) return;
        this.employeeScheduleService.deleteShift(this.selectedShift.id)
            .subscribe(
            {
                next: () => 
                {
                    this.showDeleteDialog = false;
                    this.loadPage(this.selectedPage);
                },
                error: err => console.error(err)
            });
    }

    loadPage(page: number): void
    {
        this.selectedPage = page;
        const employeeId = this.selectedEmployee()?.id;

        if (!employeeId) return;

        this.employeeScheduleService.getShifts(employeeId, this.selectedPage, this.pageSize, !this.hidePast)
            .subscribe(
            {   
                next: shiftPage => 
                {   
                    this.shifts = shiftPage.shifts;
                    this.pageCount = shiftPage.pageCount;
                },
                error: err => console.error(err)
            });
    }
}
