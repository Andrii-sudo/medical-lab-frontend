import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { EmployeePage } from '@features/employees/interfaces/employee-page.interface';
import { Employee } from '@features/employees/interfaces/employee.interface';
import { map, Observable, tap } from 'rxjs';
import { RegularShift } from '../interfaces/regular-shift.interface';
import { UpdateRegularShift } from '../interfaces/update-regular-shift.interface';
import { NewRegularShift } from '../interfaces/new-regular-shift.interface';
import { Shift } from '../interfaces/shift.interface';
import { NewShift } from '../interfaces/new-shift.interface';
import { ShiftPage } from '../interfaces/shift-page.interface';

@Injectable({
    providedIn: 'root'
})
export class EmployeeScheduleService 
{
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/Employees`;
  
    getEmployees(searchTerm: string): Observable<Employee[]>
    {
         let params = new HttpParams()
            .set("page", 1)
            .set("pageSize", 5)
            .set("searchTerm", searchTerm);

        return this.http
            .get<EmployeePage>(`${this.apiUrl}`, { params })
            .pipe(map(res => res.employees));
    }

    getRegularSchedule(employeeId: number): Observable<(RegularShift | null)[]>
    {
        return this.http.get<(RegularShift | null)[]>(`${this.apiUrl}/${employeeId}/regular-schedule`);
    }

    createRegularShift(regularShift: NewRegularShift): Observable<void>
    {
        return this.http.post<void>(`${this.apiUrl}/regular-schedule`, regularShift);
    }

    updateRegularShift(regularShift: UpdateRegularShift): Observable<void>
    {
        return this.http.put<void>(`${this.apiUrl}/regular-schedule`, regularShift);
    }

    deleteRegularShift(regularShiftId: number): Observable<void>
    {
        return this.http.delete<void>(`${this.apiUrl}/regular-schedule/${regularShiftId}`);
    }


    getShifts(employeeId: number, page: number, pageSize: number, includePast: boolean): Observable<ShiftPage>
    {
        const params = new HttpParams()
            .set('page', page)
            .set('pageSize', pageSize)
            .set('includePast', includePast);

        return this.http.get<ShiftPage>(`${this.apiUrl}/${employeeId}/shifts`, { params });
    }

    createShift(shift: NewShift): Observable<void>
    {
        return this.http.post<void>(`${this.apiUrl}/shifts`, shift);
    }

    deleteShift(shiftId: number): Observable<void>
    {
        return this.http.delete<void>(`${this.apiUrl}/shifts/${shiftId}`);
    }
}
