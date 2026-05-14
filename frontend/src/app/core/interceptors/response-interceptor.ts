import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';
import { AuthService } from '@app/features/home/services/auth.service';


let isRefreshing = false;
const refreshToken$ = new BehaviorSubject<string | null>(null);

export const responseInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Solo manejamos 401 y solo si no es una request de auth
      // para evitar loops infinitos si el refresh también falla
      if (error.status !== 401 || isAuthRequest(req)) {
        return throwError(() => error);
      }

      return handle401(req, next, authService);
    }),
  );
};

function handle401(req: HttpRequest<unknown>, next: HttpHandlerFn, authService: AuthService) {
  if (isRefreshing) {
    return refreshToken$.pipe(
      filter((token): token is string => token !== null),
      take(1),
      switchMap((token) => next(addToken(req, token))),
    );
  }

  // Iniciamos el refresh
  isRefreshing = true;
  refreshToken$.next(null);

  return authService.refresh().pipe(
    switchMap((response) => {
      const newToken = response.data!.accessToken;
      isRefreshing = false;
      refreshToken$.next(newToken); // notifica a requests en espera
      return next(addToken(req, newToken)); // reintenta la request original
    }),
    catchError((refreshError) => {
      // El refresh falló — sesión expirada, logout
      isRefreshing = false;
      refreshToken$.next(null);
      authService.logout();
      return throwError(() => refreshError);
    }),
  );
}

function addToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}

function isAuthRequest(req: HttpRequest<unknown>): boolean {
  return req.url.includes('/auth/');
}
