import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorService } from '@app/core/services/error.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = mapErrorToMessage(error);
      errorService.handle(message);
      return throwError(() => error);
    }),
  );
};

function mapErrorToMessage(error: HttpErrorResponse): string {
  if (!navigator.onLine) return 'Sin conexión a internet.';
  if (error.status === 0) return 'No se pudo conectar con el servidor.';

  const backendMessage = error.error?.message;

  switch (error.status) {
    case 400:
      return backendMessage ?? 'Solicitud inválida.';
    case 403:
      return backendMessage ?? 'Acceso denegado.';
    case 404:
      return backendMessage ?? 'Recurso no encontrado.';
    case 500:
      return 'Error interno del servidor. Intenta más tarde.';
    case 503:
      return 'Servicio no disponible. Intenta más tarde.';
    default:
      return backendMessage ?? `Error inesperado (${error.status}).`;
  }
}
