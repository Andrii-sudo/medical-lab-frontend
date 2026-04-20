import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { environment } from "@env/environment";
import { AuthResponse } from "./interfaces/auth-response";
import { User } from "./interfaces/user.interface";
import { Observable, tap } from "rxjs";
import { UserRole } from "./user-role.enum";

@Injectable({ 
    providedIn: 'root' 
})
export class AuthService
{
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/Auth`;
    private lcName = 'user_info';
    currentUser = signal<User | null>(null);

    userId = computed(() => this.currentUser()?.id);
    userRole = computed(() => this.currentUser()?.role);

    constructor()
    {
        const savedUser = localStorage.getItem(this.lcName);
        if (savedUser)
        {
            this.currentUser.set(JSON.parse(savedUser));
        }
    }

    loginEmployee(email: string, password: string): Observable<AuthResponse>
    {
        return this.http.post<AuthResponse>(`${this.apiUrl}/employee/login`, 
            {
                email: email, 
                password: password
            }).pipe(
                tap(res => this.setCurrentUser(res)
            ));
    }
    
    loginPatient(phone: string, password: string): Observable<AuthResponse>
    {
        return this.http.post<AuthResponse>(`${this.apiUrl}/patient/login`, 
            {
                phone: phone, 
                password: password
            }).pipe(
                tap(res => this.setCurrentUser(res)
            ));
    }

    logout(): Observable<void>
    {
        return this.http.post<void>(`${this.apiUrl}/logout`, null)
            .pipe(tap(() => this.removeCurrentUser()));
    }

    private setCurrentUser(ar: AuthResponse): void
    {
        this.currentUser.set({ id: ar.id, role: ar.role as UserRole });
        localStorage.setItem(this.lcName, JSON.stringify(this.currentUser()));
    }

    removeCurrentUser(): void
    {
        localStorage.removeItem(this.lcName);
        this.currentUser.set(null);
    }
}