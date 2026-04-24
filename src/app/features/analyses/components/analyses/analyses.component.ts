import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AnalysisService } from '@features/analyses/services/analysis.service';
import { Analysis } from '../../interfaces/analysis.interface';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-analyses',
  imports: [NavbarComponent, PaginationComponent],
  templateUrl: './analyses.component.html',
  styleUrl: './analyses.component.css'
})
export class AnalysesComponent implements OnInit, OnDestroy
{
    private analysisService = inject(AnalysisService); 

    searchTerm = '';
    analyses: Analysis[] = [];

    selectedPage = 1;
    pageCount = 1;
    pageSize = 12; // Для карток краще брати більшу кількість (напр. 12)

    private searchSubject = new Subject<string>();
    private searchSub!: Subscription;

    ngOnInit(): void 
    {
        this.searchSub = this.searchSubject.pipe(
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe(term => 
        {
            this.searchTerm = term;
            this.loadPage(1);
        });

        this.loadPage(1);
    }

    ngOnDestroy(): void 
    {
        this.searchSub?.unsubscribe();
    }

    onSearchChange(e: Event): void
    {
        const target = e.target as HTMLInputElement;
        this.searchSubject.next(target.value);
    }

    loadPage(page: number): void
    {
        this.selectedPage = page;
        
        this.analysisService.getAnalysesPage(this.selectedPage, this.pageSize, this.searchTerm)
            .subscribe(
            {
                next: pageData => 
                {
                    this.analyses = pageData.analyses;
                    this.pageCount = pageData.pageCount;
                },
                error: err => console.error(err)
            });
    }
}
