import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee } from '@features/employees/interfaces/employee.interface';
import { NewEmployee } from '@features/employees/interfaces/new-employee.interface';
import { EmployeeService } from '@features/employees/services/employee.service';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
    selector: 'app-employee-form',
    imports: [ModalComponent, ReactiveFormsModule],
    templateUrl: './employee-form.component.html',
    styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnInit
{
    private employeeService = inject(EmployeeService);
    private fb = inject(FormBuilder);

    employee = input<Employee | null>(null);

    cancel = output<void>();
    confirm = output<void>();

    employeeForm = this.fb.group(
    {
        firstName:  ['', Validators.required],
        lastName:   ['', Validators.required],
        middleName: [''],
        phone:      ['', Validators.required],
        email:      ['', [Validators.required, Validators.email]],
        password:   ['', [Validators.required, Validators.minLength(6)]],
        isAdmin:    [false]
    });

    errorMessage = '';

    get isEditMode(): boolean 
    {
        return this.employee() !== null;
    }

    get title(): string 
    {
        return this.isEditMode ? 'Редагувати працівника' : 'Додати нового працівника';
    }

    ngOnInit(): void 
    {
        if (this.isEditMode)
        {
            this.employeeForm.get('password')?.clearValidators();
            this.employeeForm.get('password')?.updateValueAndValidity();

            this.employeeForm.get('isAdmin')?.disable();

            const emp = this.employee()!;
            this.employeeForm.patchValue(
            {
                lastName: emp.lastName,
                firstName: emp.firstName,
                middleName: emp.middleName || '',
                phone: emp.phone,
                email: emp.email,
                isAdmin: emp.isAdmin
            });
        }
    }

    onCancel()
    {
        this.cancel.emit();
    }

    onSubmit()
    {
        if (!this.employeeForm.valid)
        {
            this.employeeForm.markAllAsTouched();
            return;
        }

        const formData = this.employeeForm.getRawValue();

        if (!this.isEditMode)
        {
            this.employeeService.createEmployee(formData as NewEmployee).subscribe(
            {
                next: () => this.confirm.emit(),
                error: err => 
                { 
                    this.errorMessage = err?.error?.msg; 
                    console.error(err); 
                }
            });
        }
        else
        {
            const updatedEmployee = { id: this.employee()!.id, ...formData };
            
            this.employeeService.updateEmployee(updatedEmployee as Employee).subscribe(
            {
                next: () => this.confirm.emit(),
                error: err => 
                { 
                    this.errorMessage = err?.error?.msg; 
                    console.error(err);
                }
            });
        }
    }
}
