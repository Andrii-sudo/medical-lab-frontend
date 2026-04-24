import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { Result } from '../interfaces/result.interface';
import { ResultStatus } from '../enums/result-status.enum';
import { ResultFormComponent } from './result-form/result-form.component';
import { Router } from '@angular/router';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { SearchType } from '../enums/search-type.enum';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { ResultService } from '../services/result.service';
import { AuthService } from '@core/auth/auth.service';
import { UserRole } from '@core/auth/user-role.enum';

@Component({
    selector: 'app-results',
    imports: [NavbarComponent, ResultFormComponent, PaginationComponent, FormsModule],
    templateUrl: './results.component.html',
    styleUrl: './results.component.css'
})
export class ResultsComponent implements OnInit, OnDestroy
{
    private authService = inject(AuthService);
    private resultService = inject(ResultService);
    private router = inject(Router);

    userRole = this.authService.userRole;
    UserRole = UserRole; 

    SearchType = SearchType;
    ResultStatus = ResultStatus;

    showResultForm = false;
    isEditMode = false;
    selectedResult!: Result;

    searchTerm = '';
    searchType: SearchType = SearchType.Order;

    selectedPage = 1;
    pageCount = 1;
    pageSize = 6;

    results: Result[] = [];
    
    private searchSubject = new Subject<string>();
    private searchSub!: Subscription;

    constructor()
    {
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras.state as { orderNumber?: number, patientName?: string}; 

        if (state)
        {
            if (state.orderNumber)
            {
                this.searchTerm = state.orderNumber.toString();
                this.searchType = SearchType.Order;
            }
            else if (state.patientName)
            {
                this.searchTerm = state.patientName;
                this.searchType = SearchType.Patient;
            }
        }
    }

    ngOnInit(): void 
    {
        this.loadPage(1);
            
        this.searchSub = this.searchSubject.pipe(
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe(term => 
        {
            this.searchTerm = term;
            this.loadPage(1);
        });
    }
    
    ngOnDestroy(): void 
    {
        this.searchSub.unsubscribe();
    }
    
    onSearchChange(e: Event): void
    {
        const target = e.target as HTMLInputElement;
        const value = target.value.trim();
    
        this.searchSubject.next(value);
    }

    get searchPlaceholder()
    {
        switch (this.searchType)
        {
            case SearchType.Order:
                return 'Введіть номер замовлення';
            case SearchType.Patient:
                return 'Введіть ім\'я або тел. номер пацієнта';
        }
        return 'Пошук замовлення';
    }

    getStatusLabel(rs: ResultStatus)
    {
        switch (rs)
        {
            case ResultStatus.Pending:
                return 'Очікує внесення';
            case ResultStatus.Normal:
                return 'Норма';
            case ResultStatus.Abnormal:
                return 'Відхилення';
        }        
    }

    onEnterResult(r: Result)
    {
        this.selectedResult = r;
        this.isEditMode = true;
        this.showResultForm = true; 
    }

    onReveiwResult(r: Result)
    {
        this.selectedResult = r;    
        this.isEditMode = false;    
        this.showResultForm = true; 
    }

    onConfirmResult()
    {
        this.loadPage(this.selectedPage);
        this.showResultForm = false; 
    }

    loadPage(page: number): void
    {
        this.selectedPage = page;

        if (this.userRole() === this.UserRole.Patient)
        {
            this.resultService.getPatientResultsPage(page, this.pageSize)
                .subscribe(
                {
                    next: resultPage => 
                    {
                        this.results = resultPage.results;
                        this.pageCount = resultPage.pageCount;
                    },
                    error: err => console.error(err)
                });
        }
        else
        {
            this.resultService.getResultsPage(page, this.pageSize, this.searchType, this.searchTerm)
                .subscribe(
                {
                    next: resultPage => 
                    {
                        this.results = resultPage.results;
                        this.pageCount = resultPage.pageCount;
                    },
                    error: err => console.error(err)
                });
        }
    }
}
