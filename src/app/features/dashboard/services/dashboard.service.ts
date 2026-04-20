import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { EmployeeStats } from '../interfaces/employee-stat.interface';
import { EmployeeSample } from '../interfaces/employee-sample.interface';
import { EmployeeShift } from '../interfaces/employee-shift.interface';

@Injectable({
    providedIn: 'root'
})
export class DashboardService 
{
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/Dashboard`;

    getEmployeeStats(selectedOfficeId: number): Observable<EmployeeStats>
    {
        return this.http.get<EmployeeStats>(
            `${this.apiUrl}/EmployeeStats/`, 
            { params: { officeId: selectedOfficeId } }
        );
    }

    getEmployeeShifts(employeeId: number): Observable<EmployeeShift[]>
    {
        return this.http.get<EmployeeShift[]>(
            `${this.apiUrl}/EmployeeShifts/`, 
            { params: { employeeId: employeeId } }
        );
    }

    getEmployeeSamples(selectedOfficeId: number): Observable<EmployeeSample[]>
    {
        return this.http.get<EmployeeSample[]>(
            `${this.apiUrl}/EmployeeSamples/`, 
            { params: { officeId: selectedOfficeId } }
        );
    }
}
