import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderPage } from '../interfaces/order-page.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { SearchType } from '../enums/search-type.enum';

@Injectable({
    providedIn: 'root'
})
export class OrderService 
{
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/Orders`;

    getOrdersPage(page: number, pageSize: number, searchType: SearchType, searchTerm?: string): Observable<OrderPage>
    {
        let params = new HttpParams()
            .set("page", page)
            .set("pageSize", pageSize);
    
        if (searchTerm)
        {
            if (searchType === SearchType.Number)
            {
                params = params.set("number", searchTerm); 
            }
            else if (searchType === SearchType.Patient)
            {
                params = params.set("patient", searchTerm);
            }
        } 

        let orderPage: Observable<OrderPage>;

        if (searchType === SearchType.Number)
        {
            orderPage = this.http.get<OrderPage>(`${this.apiUrl}/by-number`, { params }); 
        }
        else if (searchType === SearchType.Patient)
        {
            orderPage = this.http.get<OrderPage>(`${this.apiUrl}/by-patient`, { params }); 
        }

        return orderPage!;
    }

    payOrder(number: number): Observable<void>
    {
        return this.http.put<void>(`${this.apiUrl}/${number}/pay`, null);
    }

    cancelOrder(number: number): Observable<void>
    {
        return this.http.put<void>(`${this.apiUrl}/${number}/cancel`, null);
    }
}
