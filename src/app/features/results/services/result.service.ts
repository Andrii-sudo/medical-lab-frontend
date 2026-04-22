import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { SearchType } from '../enums/search-type.enum';
import { Observable } from 'rxjs';
import { ResultPage } from '../interfaces/result-page.interface';
import { ResultParameter } from '../interfaces/result-parameter.interface';
import { UpdateResultParameter } from '../interfaces/update-result-parameter.interface';

@Injectable({
    providedIn: 'root'
})
export class ResultService 
{
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/Results`;
  
    getResultsPage(page: number, pageSize: number, searchType: SearchType, searchTerm?: string): Observable<ResultPage>
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

        let resultPage: Observable<ResultPage>;

        if (searchType === SearchType.Order)
        {
            resultPage = this.http.get<ResultPage>(`${this.apiUrl}/by-order`, { params }); 
        }
        else if (searchType === SearchType.Patient)
        {
            resultPage = this.http.get<ResultPage>(`${this.apiUrl}/by-patient`, { params }); 
        }

        return resultPage!;
    }

    getResultParameters(resultId: number): Observable<ResultParameter[]>
    {
        return this.http.get<ResultParameter[]>(`${this.apiUrl}/${resultId}/parameters`);
    }

    updateResultParameters(resultParameters: UpdateResultParameter[]): Observable<void>
    {
        return this.http.put<void>(`${this.apiUrl}/parameters`, resultParameters);
    }
}
