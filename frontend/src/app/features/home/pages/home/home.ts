import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Button } from '@app/shared/components/button/button';
import { AppInput } from '@app/shared/components/input/input';

const NAME_STORAGE_KEY = 'name';
const EMAIL_STORAGE_KEY = 'email';

@Component({
  selector: 'app-home',
  imports: [CommonModule, AppInput, Button],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  private readonly router = inject(Router);

  readonly name = signal('');
  readonly email = signal('');
  readonly nameTouched = signal(false);
  readonly emailTouched = signal(false);

  onNameChange(value: string): void {
    this.name.set(value);
    if (!this.nameTouched()) {
      this.nameTouched.set(true);
    }
  }

  onEmailChange(value: string): void {
    this.email.set(value);
    if (!this.emailTouched()) {
      this.emailTouched.set(true);
    }
  }

  onNameBlur(): void {
    this.nameTouched.set(true);
  }

  onEmailBlur(): void {
    this.emailTouched.set(true);
  }

  submit(): void {
    const name = this.name().trim();
    const email = this.email().trim();

    this.nameTouched.set(true);
    this.emailTouched.set(true);

    if (!name || !email) return;

    localStorage.setItem(NAME_STORAGE_KEY, name);
    localStorage.setItem(EMAIL_STORAGE_KEY, email);
    this.router.navigate(['/post']);
  }

  nameError(): string {
    return this.nameTouched() && !this.name().trim() ? 'El nombre es requerido.' : '';
  }

  emailError(): string {
    return this.emailTouched() && !this.email().trim() ? 'El correo es requerido.' : '';
  }
}
