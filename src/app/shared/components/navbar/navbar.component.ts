import { Component, inject, OnInit, Signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { UserRole } from '@core/auth/user-role.enum';
import { Office } from '@core/interfaces/office.interface';
import { SelectedOfficeService } from '@core/services/selected-office.service';

@Component
({
    selector: 'app-navbar',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit 
{
    private authService = inject(AuthService);
    private router = inject(Router);
    private selcOfficeService = inject(SelectedOfficeService);

    UserRole = UserRole;
    userRole = this.authService.userRole; 

    isOpen = false;
    
    availableOffices: Office[] = [];

    ngOnInit(): void 
    {
        
        const userId = this.authService.userId();
        if (userId && this.userRole() === UserRole.Employee)
        {   
            this.selcOfficeService.getEmployeeOffices(userId)
                .subscribe({ 
                    next: offices => 
                    {
                        this.availableOffices = offices ?? [];
                    
                        this.selcOfficeService.getCurrentEmployeeOffice(userId)
                            .subscribe({ 
                                next: office => this.selcOfficeService.selectedOffice.set(office ?? this.availableOffices?.[0]),
                                error: err => console.error(err)
                            });
                    },
                    error: err => console.error(err)
                });
        }
    }

    get selectedOffice(): Signal<Office | null>
    {
        return this.selcOfficeService.selectedOffice;
    }

    onOfficeChange(event: Event): void
    {
        const selectElement = event.target as HTMLSelectElement;
        const selectedId = Number(selectElement.value);

        if (!selectedId) 
        {
            this.selcOfficeService.selectedOffice.set(null);
            return;
        }

        const office = this.availableOffices.find(o => o.id === selectedId) || null;
        this.selcOfficeService.selectedOffice.set(office);
    }

    openMenu(): void
    {
        this.isOpen = true;
    }

    closeMenu(): void
    {
        this.isOpen = false;
    }

    logout(): void
    {
        this.authService.logout().subscribe({ error: err => console.error(err) });
        this.selcOfficeService.selectedOffice.set(null);
        this.router.navigate(['/login']);
    }
}
