import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common'; 
import localeUk from '@angular/common/locales/uk';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@core/auth/interceptors/auth.interceptor';

registerLocaleData(localeUk);

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        { provide: LOCALE_ID, useValue: 'uk' },
        provideHttpClient(withInterceptors([authInterceptor]))
    ]
};
