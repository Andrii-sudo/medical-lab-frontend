import { Routes } from '@angular/router';
import { LoginComponent } from '@core/auth/login/login.component'
import { DashboardComponent } from '@features/dashboard/components/dashboard.component';
import { PatientsComponent } from '@features/patients/components/patients.component';
import { OrdersComponent } from '@features/orders/components/orders.component';
import { SamplesComponent } from '@features/samples/components/samples.component';
import { ResultsComponent } from '@features/results/components/results.component';
import { UserRole } from '@core/auth/user-role.enum';
import { ErrorPageComponent } from '@core/auth/error-page/error-page.component';
import { authGuard } from '@core/auth/guards/auth.guard';
import { EmployeesComponent } from '@features/employees/components/employees.component';

export const routes: Routes = 
[
    { path: 'login',     component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canMatch: [authGuard], data: { roles: [UserRole.Admin, UserRole.Employee] } },
    { path: 'patients',  component: PatientsComponent,  canMatch: [authGuard], data: { roles: [UserRole.Admin, UserRole.Employee] } },
    { path: 'orders',    component: OrdersComponent,    canMatch: [authGuard], data: { roles: [UserRole.Admin, UserRole.Employee] } },
    { path: 'samples',   component: SamplesComponent,   canMatch: [authGuard], data: { roles: [UserRole.Admin, UserRole.Employee] } },
    { path: 'results',   component: ResultsComponent,   canMatch: [authGuard], data: { roles: [UserRole.Admin, UserRole.Employee] } },
    { path: 'employees', component: EmployeesComponent, canMatch: [authGuard], data: { roles: [UserRole.Admin] } },

    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { 
        path: '403', component: ErrorPageComponent, 
        data: 
        { 
            title: 'Не авторизовано', 
            message: 'У вас немає прав доступу для цієї дії' 
        } 
    },
    { 
        path: '**', 
        component: ErrorPageComponent, 
        data: 
        { 
            title: 'Сторінку не знайдено', 
            message: 'Сторінку не знайдено' 
        } 
    } 
];
