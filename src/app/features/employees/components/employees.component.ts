import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { Router } from '@angular/router';
import { Employee } from '../interfaces/employee.interface';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { EmployeeService } from '../services/employee.service';

@Component({
    selector: 'app-employees',
    imports: [NavbarComponent, PaginationComponent, EmployeeFormComponent, ConfirmDialogComponent],
    templateUrl: './employees.component.html',
    styleUrl: './employees.component.css'
})
export class EmployeesComponent implements OnInit, OnDestroy
{
    private employeeService = inject(EmployeeService);
    private router = inject(Router);

    selectedEmployee!: Employee;

    showAddEmployeeForm = false;
    showEditEmployeeForm = false;
    showDeleteDialog = false;
    dialogDescription = '';

    searchTerm = '';
    selectedPage = 1;
    pageCount = 1;
    pageSize = 6;

    employees: Employee[] = [];

    private searchSubject = new Subject<string>();
    private searchSub!: Subscription;
    
    ngOnInit(): void 
    {
        this.loadPage(1);
        
        this.searchSub = this.searchSubject.pipe(
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe(term => 
        {
            this.searchTerm = term;
            this.loadPage(1);
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

        this.searchSubject.next(value);
    }

    onAddEmployeeClick(): void
    {
        this.showAddEmployeeForm = true;
    }

    onEditEmployeeClick(e: Employee): void
    {
        this.selectedEmployee = e;
        this.showEditEmployeeForm = true;
    }

    onDeleteEmployeeClick(e: Employee): void
    {
        this.selectedEmployee = e;
        this.dialogDescription = `Видалити працівника ${e.lastName} ${e.firstName}?`;
        this.showDeleteDialog = true;
    }

    onAddEmployee(): void
    {
        this.showAddEmployeeForm = false;
        this.loadPage(1);
    }

    onEditEmployee(): void
    {
        this.showEditEmployeeForm = false;
        this.loadPage(this.selectedPage);
    }

    deleteEmployee(): void
    {
        this.employeeService.deleteEmployee(this.selectedEmployee.id).subscribe({
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
        this.employeeService
            .getEmployeesPage(this.selectedPage, this.pageSize, this.searchTerm)
            .subscribe(
            {
                next: employeePage => 
                {
                    this.employees = employeePage.employees;
                    this.pageCount = employeePage.pageCount;
                },
                error: err => console.error(err)
            });
    }
}
