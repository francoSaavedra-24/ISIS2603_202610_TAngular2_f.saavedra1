import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

/*
 * Implementar: HU-05 — Interceptor de Errores HTTP
 */

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (req.url.includes('weatherapi.com')) {
        toastr.error('Error al conectar con WeatherAPI. Intente más tarde.');
      } else {
        toastr.error(`Error ${error.status}: ${error.message}`);
      }

      return throwError(() => error);
    })
  );
};
