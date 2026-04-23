import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { ScheduleTab } from '../enums/schedule-tab.enum';
import { RegularScheduleComponent } from './regular-schedule/regular-schedule.component';
import { ShiftsScheduleComponent } from './shifts-schedule/shifts-schedule.component';
import { EmployeeScheduleService } from '../services/employee-schedule.service';
import { Employee } from '@features/employees/interfaces/employee.interface';
import { ShiftModalComponent } from './shift-modal/shift-modal.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-employees-schedule',
    imports: [NavbarComponent, RegularScheduleComponent, ShiftsScheduleComponent, ShiftModalComponent],
    templateUrl: './employees-schedule.component.html',
    styleUrl: './employees-schedule.component.css'
})
export class EmployeesScheduleComponent implements OnInit, OnDestroy
{
    private employeeScheduleService = inject(EmployeeScheduleService);
    private router = inject(Router);

    ScheduleTab = ScheduleTab;
    activeTab = ScheduleTab.Regural;

    showShiftForm = false;
    searchTerm = '';

    employees: Employee[] = [];
    selectedEmployee: Employee | null = null;

    private searchSubject = new Subject<string>();
    private searchSub!: Subscription;
        
    constructor()
    {
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras.state as Employee;

        if (state)
        {
            this.selectedEmployee = state;
            this.searchTerm = `${this.selectedEmployee.lastName} ${this.selectedEmployee.firstName}`;
        }
    }

    ngOnInit(): void 
    {       
        this.searchSub = this.searchSubject.pipe(
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe(term => 
        {
            this.searchTerm = term;
            

            if (!term.trim()) 
            {
                this.employees = [];
                this.selectedEmployee = null;
                return;
            }

            this.employeeScheduleService.getEmployees(term).subscribe(
            {
                next: employees => this.employees = employees,
                error: err => console.error(err)
            });
        });
    }
    
    ngOnDestroy(): void 
    {
        this.searchSub.unsubscribe();
    }
    
    onSearchChange(e: Event): void
    {
        const target = e.target as HTMLInputElement;
        const value = target.value.trim();
    
        this.selectedEmployee = null; 
        this.searchSubject.next(value);
    }

    selectEmployee(employee: Employee): void
    {
        this.selectedEmployee = employee;
        this.searchTerm = `${employee.lastName} ${employee.firstName}`;
        this.employees = [];
    }

    onAddShiftClick(): void
    {
        if (!this.selectedEmployee) return;
        this.showShiftForm = true;
    }

    onAddShift(): void
    {
        this.showShiftForm = false;
        if (this.selectedEmployee)
        {
            // викличе effect() у shifts-schedule.component
            this.selectedEmployee = { ...this.selectedEmployee }; 
        }
    }
}
