import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Office } from '@core/interfaces/office.interface';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OfficeService 
{
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/Offices`;

    getCities(): Observable<string[]>
    {
        return this.http.get<string[]>(`${this.apiUrl}/cities`);
    }

    getOffices(city: string, officeType: string | null): Observable<Office[]>
    {
        let params = new HttpParams()
            .set('city', city)
        
        if (officeType)
        {
            params = params.set('officeType', officeType);
        }

        return this.http.get<Office[]>(`${this.apiUrl}`, { params });
    }

    getAvailableSlots(officeId: number, date: string): Observable<string[]> 
    {   
        return this.http.get<string[]>(`${this.apiUrl}/${officeId}/available-slots`, { params: { date: date }});
    }
}
