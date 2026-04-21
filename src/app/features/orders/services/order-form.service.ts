import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Patient } from '../interfaces/patient.interface';
import { Analysis } from '../interfaces/analysis.interface';
import { NewOrder } from '../interfaces/new-order.interface';

@Injectable({
    providedIn: 'root'
})
export class OrderFormService 
{
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    getPatients(searchTerm: string, take: number): Observable<Patient[]>
    {
        const params = new HttpParams()
            .set('searchTerm', searchTerm)
            .set('take', take);

        return this.http.get<Patient[]>(`${this.apiUrl}/Patients/search`, { params });
    }

    getAnalyses(searchTerm: string, take: number):  Observable<Analysis[]>
    {
        const params = new HttpParams()
            .set('searchTerm', searchTerm)
            .set('take', take);

        return this.http.get<Analysis[]>(`${this.apiUrl}/Analyses/search`, { params });
    }

    createOrder(nw: NewOrder): Observable<void>
    {
        return this.http.post<void>(`${this.apiUrl}/Orders`, nw );
    }
}
