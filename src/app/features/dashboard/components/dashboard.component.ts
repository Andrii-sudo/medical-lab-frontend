import { Component, effect, inject, OnInit } from '@angular/core';
import { NgClass, SlicePipe } from '@angular/common';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { EmployeeShift } from '../interfaces/employee-shift.interface';
import { EmployeeSample } from '../interfaces/employee-sample.interface';
import { ExpiryDatePipe } from '../pipes/expiry-date.pipe';
import { RouterLink } from '@angular/router';
import { EmployeeStats } from '../interfaces/employee-stat.interface';
import { DashboardService } from '../services/dashboard.service';
import { SelectedOfficeService } from '@core/services/selected-office.service';
import { AuthService } from '@core/auth/auth.service';
import { UserRole } from '@core/auth/user-role.enum';

@Component({
    selector: 'app-dashboard',
    imports: [NavbarComponent, ExpiryDatePipe, NgClass, RouterLink, SlicePipe],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit
{
    private dashboardService = inject(DashboardService);
    private selcOffice = inject(SelectedOfficeService);
    private authService = inject(AuthService);

    UserRole = UserRole;
    userRole = this.authService.userRole; 

    today = new Date().toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });

    employeeStats?: EmployeeStats;
    employeeShifts: EmployeeShift[] = [];
    employeeSamples: EmployeeSample[] = [];

    constructor()
    {
        effect(() =>
        {
            const office = this.selcOffice.selectedOffice();
            
            if (office)
            {
                this.dashboardService.getEmployeeStats(office.id)
                    .subscribe({ 
                        next: empStats => this.employeeStats = empStats, 
                        error: err => console.error(err)
                    });

                this.dashboardService.getEmployeeSamples(office.id)
                    .subscribe({ 
                        next: empSamples => this.employeeSamples = empSamples, 
                        error: err => console.error(err)
                    });
            }
        });
    }

    ngOnInit(): void
    {
        const user = this.authService.currentUser();

        if (user && user.role === UserRole.Employee)
        {
            this.dashboardService.getEmployeeShifts(user.id)
                .subscribe({ 
                    next: empShifts => this.employeeShifts = empShifts, 
                    error: err => console.error(err)
                });
        }
    }

    getDayOfWeekLabel(dayOfWeek: number): string
    {
        switch(dayOfWeek)
        {
            case 0:
                return 'Нд';
            case 1:
                return 'Пн';
            case 2:
                return 'Вт';
            case 3:
                return 'Ср';
            case 4:
                return 'Чт';
            case 5:
                return 'Пт';
            case 6:
                return 'Сб';    
            default:
                return '-';
        }
    }

    getSampleStatus(sampleExpiryDate: string): string
    {
        const expiry = new Date(sampleExpiryDate);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const diffInDays = Math.round((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays <= 1)
        {
            return 'dot-red';
        }
        else if (diffInDays <= 3) 
        {
            return 'dot-yellow';
        }
        
        return 'dot-green';
    }
}
