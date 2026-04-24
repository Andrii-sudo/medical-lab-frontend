import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { AnalysisPage } from '../interfaces/analysis-page.interface';

@Injectable({
    providedIn: 'root'
})
export class AnalysisService 
{
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/Analyses`;

    getAnalysesPage(page: number, pageSize: number, searchTerm?: string): Observable<AnalysisPage>
    {
        let params = new HttpParams()
            .set('page', page)
            .set('pageSize', pageSize);

        if (searchTerm)
        {
            params = params.set('searchTerm', searchTerm!);
        }   

        return this.http.get<AnalysisPage>(`${this.apiUrl}/`, { params });
    }
}
