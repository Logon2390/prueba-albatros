import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { ApiResponse } from '@app/shared/model/api-response.model';
import { AuthTokens, LoginPayload } from '@app/shared/model/auth.model';
import {
  clearStorageSession,
  getStorageItem,
  setStorageSession,
  setStorageTokens,
} from '@core/utils/auth.utils';

const BASE_URL = 'http://localhost:3000/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _userName = signal(getStorageItem('name'));
  private readonly _userEmail = signal(getStorageItem('email'));
  private readonly _accessToken = signal(getStorageItem('accessToken'));
  private readonly _refreshToken = signal(getStorageItem('refreshToken'));

  readonly userName = this._userName.asReadonly();
  readonly userEmail = this._userEmail.asReadonly();
  readonly accessToken = this._accessToken.asReadonly();
  readonly isLoggedIn = computed(() => !!this._accessToken());

  login(payload: LoginPayload) {
    return this.http.post<ApiResponse<AuthTokens>>(`${BASE_URL}/login`, payload).pipe(
      tap((response) => {
        const { accessToken, refreshToken } = response.data!;
        setStorageSession(payload.name, payload.email, accessToken, refreshToken);
        this._userName.set(payload.name);
        this._userEmail.set(payload.email);
        this._accessToken.set(accessToken);
        this._refreshToken.set(refreshToken);
      }),
    );
  }

  refresh() {
    return this.http
      .post<ApiResponse<AuthTokens>>(`${BASE_URL}/refresh`, {
        refreshToken: this._refreshToken(),
      })
      .pipe(
        tap((response) => {
          const { accessToken, refreshToken } = response.data!;
          setStorageTokens(accessToken, refreshToken);
          this._accessToken.set(accessToken);
          this._refreshToken.set(refreshToken);
        }),
      );
  }

  logout(): void {
    clearStorageSession();
    this._userName.set('Anonymous');
    this._userEmail.set('');
    this._accessToken.set('');
    this._refreshToken.set('');
    this.router.navigate(['']);
  }
}
