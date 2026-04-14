import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (request, next) =>
{
    const reqWithCookie = request.clone({ withCredentials: true });

    return next(reqWithCookie);
}
