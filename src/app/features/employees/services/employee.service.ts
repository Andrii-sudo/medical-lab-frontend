import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { EmployeePage } from '../interfaces/employee-page.interface';
import { Observable } from 'rxjs';
import { NewEmployee } from '../interfaces/new-employee.interface';
import { Employee } from '../interfaces/employee.interface';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService 
{
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/Employees`; 
  
    getEmployeesPage(page: number, pageSize: number, searchTerm?: string): Observable<EmployeePage>
    {
        let params = new HttpParams()
            .set("page", page)
            .set("pageSize", pageSize);
    
        if (searchTerm)
        {
            params = params.set("searchTerm", searchTerm); 
        } 

        return this.http.get<EmployeePage>(this.apiUrl, { params });
    }

    createEmployee(employee: NewEmployee): Observable<void>
    {
        return this.http.post<void>(this.apiUrl, employee);
    }

    updateEmployee(employee: Employee): Observable<void>
    {
        return this.http.put<void>(this.apiUrl, employee);
    }

    deleteEmployee(employeeId: number): Observable<void>
    {
        return this.http.delete<void>(`${this.apiUrl}/${employeeId}`);
    }
    
}
