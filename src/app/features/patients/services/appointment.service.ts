import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { NewAppointment } from '../interfaces/new-appointment.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppointmentService 
{
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    createAppointment(app: NewAppointment): Observable<void>
    {
        return this.http.post<void>(`${this.apiUrl}/Appointments`, app);
    }
}
