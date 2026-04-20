import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { NewAppointment } from '../interfaces/new-appointment.interface';
import { Observable } from 'rxjs';
import { Appointment } from '../interfaces/appointment.interface';
import { formatDate } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AppointmentService 
{
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/Appointments`;

    createAppointment(app: NewAppointment): Observable<void>
    {
        return this.http.post<void>(`${this.apiUrl}`, app);
    }

    getDailyAppointments(officeId: number, date: Date): Observable<Appointment[]>
    {
        const dateString = formatDate(date, 'yyyy-MM-dd', 'en-US');
        
        const params = new HttpParams()
            .set('officeId', officeId)
            .set('date', dateString);
        
        return this.http.get<Appointment[]>(`${this.apiUrl}`, { params });
    }

    advanceAppointment(appId: number): Observable<void>
    {
        return this.http.put<void>(`${this.apiUrl}/${appId}/advance`, null);
    }

    cancelAppointment(appId: number): Observable<void>
    {
        return this.http.put<void>(`${this.apiUrl}/${appId}/cancel`, null);
    }
}
