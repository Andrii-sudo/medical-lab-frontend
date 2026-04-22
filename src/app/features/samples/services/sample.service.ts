import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { SearchType } from '../enums/search-type.enum';
import { SamplePage } from '../interfaces/sample-page.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SampleService 
{
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/Samples`;
    
    getSamplesPage(page: number, pageSize: number, searchType: SearchType, searchTerm?: string): Observable<SamplePage>
    {
        let params = new HttpParams()
            .set("page", page)
            .set("pageSize", pageSize);
    
        if (searchTerm)
        {
            if (searchType === SearchType.Order)
            {
                params = params.set("orderNumber", searchTerm); 
            }
            else if (searchType === SearchType.Patient)
            {
                params = params.set("patient", searchTerm);
            }
        } 

        let samplePage: Observable<SamplePage>;

        if (searchType === SearchType.Order)
        {
            samplePage = this.http.get<SamplePage>(`${this.apiUrl}/by-order`, { params }); 
        }
        else if (searchType === SearchType.Patient)
        {
            samplePage = this.http.get<SamplePage>(`${this.apiUrl}/by-patient`, { params }); 
        }

        return samplePage!;
    }

    collectSample(sampleId: number): Observable<void>
    {
        return this.http.put<void>(`${this.apiUrl}/${sampleId}/collect`, null);
    }
}
