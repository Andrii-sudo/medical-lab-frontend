import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (request, next) =>
{
    const reqWithCookie = request.clone({ withCredentials: true });

    const authService = inject(AuthService);

    return next(reqWithCookie).pipe(catchError((error: HttpErrorResponse) => 
        {
            // if token expired
            if (error.status === 401) 
            {
                authService.removeCurrentUser(); 
            }
            return throwError(() => error);
        }));
}
