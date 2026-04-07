import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component
({
    selector: 'app-navbar',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent 
{
    isOpen = false;

    openMenu(): void
    {
        this.isOpen = true;
    }

    closeMenu(): void
    {
        this.isOpen = false;
    }
}
