import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Office } from '@core/interfaces/office.interface';

@Injectable({
    providedIn: 'root'
})
export class SelectedOfficeService 
{
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/Offices`;

    selectedOffice = signal<Office | null>(null);

    getCurrentEmployeeOffice(userId: number): Observable<Office | null>
    {
        return this.http.get<Office | null>(`${this.apiUrl}/employee/current`, { params: { employeeId: userId }});
    }

    getEmployeeOffices(userId: number): Observable<Office[] | null>
    {
        return this.http.get<Office[] | null>(`${this.apiUrl}/employee`, { params: { employeeId: userId }});
    }
}
