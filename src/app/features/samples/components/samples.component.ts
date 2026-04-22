import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Sample } from '../interfaces/sample.interface';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { SampleStatus } from '../enums/sample-status.enum';
import { DatePipe } from '@angular/common';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavigationState } from '../interfaces/navigation-state.interface';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { SearchType } from '../enums/search-type.enum';
import { SampleService } from '../services/sample.service';

@Component({
    selector: 'app-samples',
    imports: [NavbarComponent, ConfirmDialogComponent, PaginationComponent, FormsModule, RouterLink, DatePipe],
    templateUrl: './samples.component.html',
    styleUrl: './samples.component.css'
})
export class SamplesComponent implements OnInit, OnDestroy
{
    private sampleService = inject(SampleService);
    private router = inject(Router);

    SearchType = SearchType;
    SampleStatus = SampleStatus;

    searchTerm = '';
    searchType: SearchType = SearchType.Order;

    showCollectDialog = false;
    selectedSample?: Sample;
    dialogTitle = '';
    dialogDescription = '';

    selectedPage = 1;
    pageCount = 1;
    pageSize = 6;

    samples: Sample[] = [];

    private searchSubject = new Subject<string>();
    private searchSub!: Subscription;

    constructor()
    {
        const navigation = this.router.getCurrentNavigation();
        let state = navigation?.extras.state as NavigationState;

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
            case 'order':
                return 'Введіть номер замовлення';
            case 'patient':
                return 'Введіть ім\'я або тел. номер пацієнта';
        }
        return 'Пошук зразка';
    }

    getStatusLabel(ss: SampleStatus): string
    {
        switch (ss)
        {
            case SampleStatus.Waiting:
                return "Очікує збору";
            case SampleStatus.Collected:
                return "Зібраний";
            case SampleStatus.Analyzed:
                return "Досліджений";
            case SampleStatus.Expired:
                return "Протермінований";
        }
    }

    onCollectClick(s: Sample): void
    {
        this.selectedSample = s;    
        this.dialogTitle = 'Зібрати зразок';
        this.dialogDescription = `Зібрати зразок пацієнта ${s.patientLastName} ${s.patientFirstName}?`;
        this.showCollectDialog = true;
    }

    collectSample(sId: number): void
    {
        this.sampleService.collectSample(sId)
            .subscribe(
            {
                next: () =>
                {
                    this.loadPage(this.selectedPage);
                    this.showCollectDialog = false;
                },
                error: err =>
                {
                    console.error(err);
                } 
            });
    }

    loadPage(page: number): void
    {
        this.selectedPage = page;
        this.sampleService
            .getSamplesPage(this.selectedPage, this.pageSize, this.searchType, this.searchTerm)
            .subscribe(
            {
                next: samplePage => 
                {
                    this.samples = samplePage.samples;
                    this.pageCount = samplePage.pageCount;
                },
                error: err => console.error(err)
            });
    }
}
