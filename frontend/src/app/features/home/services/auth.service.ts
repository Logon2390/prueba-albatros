import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _userName = signal(localStorage.getItem('name') ?? 'Anonymous');
  private readonly _userEmail = signal(localStorage.getItem('email') ?? '');

  readonly userName = this._userName.asReadonly();
  readonly userEmail = this._userEmail.asReadonly();
  readonly isLoggedIn = computed(() => this._userName() !== 'Anonymous');

  login(name: string, email: string): void {
    localStorage.setItem('name', name);
    localStorage.setItem('email', email);
    this._userName.set(name);
    this._userEmail.set(email);
  }

  logout(router: Router): void {
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    this._userName.set('Anonymous');
    this._userEmail.set('');
    router.navigate(['']);
  }
}