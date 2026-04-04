import { Component, computed, EventEmitter, input, Output } from '@angular/core';

@Component({
    selector: 'app-pagination',
    imports: [],
    templateUrl: './pagination.component.html',
    styleUrl: './pagination.component.css'
})
export class PaginationComponent 
{
    selectedPage = input.required<number>();
    pageCount = input.required<number>();

    @Output() changePage = new EventEmitter<number>();

    visablePages = computed(() =>
    {
        const pages = new Set<number>();
        
        const prev = this.selectedPage() - 1;
        const selc = this.selectedPage();
        const next = this.selectedPage() + 1;
        const cnt = this.pageCount();

        pages.add(1);
        if (prev > 1) 
        {
            pages.add(prev);
        }
        pages.add(selc)
        if (next < cnt)
        {
            pages.add(next);
        }
        pages.add(cnt);

        return Array.from(pages);
    });

    onChangePageClick(page: number): void
    {
        this.changePage.emit(page);
    }
}
