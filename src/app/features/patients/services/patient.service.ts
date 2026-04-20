import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Patient } from '../interfaces/patient.interface';
import { PatientPage } from '../interfaces/patient-page.interface';
import { NewPatient } from '../interfaces/new-patient.interface';

@Injectable({
    providedIn: 'root'
})
export class PatientService 
{
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/Patients`;

    getPatientsPage(page: number, pageSize: number, searchTerm?: string): Observable<PatientPage>
    {
        let params = new HttpParams()
            .set("page", page)
            .set("pageSize", pageSize);
    
        if (searchTerm)
        {
            params = params.set("searchTerm", searchTerm);
        } 
        
        return this.http.get<PatientPage>(`${this.apiUrl}`, { params });
    }

    createPatient(p: NewPatient): Observable<void>
    {
        return this.http.post<void>(`${this.apiUrl}`, p);
    }

    updatePatient(p: Patient): Observable<void>
    {
        return this.http.put<void>(`${this.apiUrl}`, p);
    }
}
