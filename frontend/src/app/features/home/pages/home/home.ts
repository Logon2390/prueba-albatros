import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';
import { Button } from '@app/shared/components/button/button';
import { AppInput } from '@app/shared/components/input/input';
import { AutoFocusDirective } from '@app/shared/directives/autofocus';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule, AppInput, Button, AutoFocusDirective],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly isLoading = signal(false);

  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  private readonly status = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  readonly isFormValid = computed(() => this.status() === 'VALID' && !this.isLoading());

  getError(field: 'name' | 'email'): string {
    const control = this.form.controls[field];
    if (!control.touched) return '';
    if (control.hasError('required')) return 'Este campo es requerido.';
    if (control.hasError('email')) return 'El correo no es válido.';
    if (control.hasError('minlength')) return 'Mínimo 2 caracteres.';
    return '';
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isLoading()) return;

    const { name, email } = this.form.getRawValue();

    this.isLoading.set(true);
    this.authService.login({ name: name.trim(), email: email.trim() }).subscribe({
      next: () => this.router.navigate(['/posts']),
      error: () => this.isLoading.set(false),
    });
  }
}
