import { Component, inject, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-error-page',
    imports: [],
    templateUrl: './error-page.component.html',
    styleUrl: './error-page.component.css'
})
export class ErrorPageComponent implements OnInit
{
    private route = inject(ActivatedRoute);
    private location = inject(Location);

    title = '';
    message = '';

    ngOnInit(): void
    {
        this.route.data.subscribe(data =>
        {
            this.title = data['title'];
            this.message = data['message'];
        });
    }

    goBack(): void
    {
        this.location.back();
    }
}
