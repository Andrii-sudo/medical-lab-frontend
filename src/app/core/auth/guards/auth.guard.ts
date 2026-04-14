import { inject } from "@angular/core";
import { CanMatchFn, RedirectCommand, Router } from "@angular/router";
import { routes } from "src/app/app.routes";
import { AuthService } from "../auth.service";


export const authGuard: CanMatchFn = (route, segments) =>
{
    if (!route.data || !route.data['roles']) return true;

    const authService = inject(AuthService);
    const router = inject(Router);
    
    const userRole = authService.userRole();

    if (userRole && route.data['roles'].includes(userRole))
    {
        return true;
    }
    
    const forbiddenUrl = router.parseUrl('/403');
    return new RedirectCommand(forbiddenUrl);
}