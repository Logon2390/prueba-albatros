import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppInput),
      multi: true,
    },
  ],
})
export class AppInput implements ControlValueAccessor {
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() label = '';
  @Input() id = '';
  @Input() error = false;
  @Input() errorText = '';
  @Input() value = '';
  @Output() blur = new EventEmitter<void>();
  @Output() valueChange = new EventEmitter<string>();

  protected isDisabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  get errorId(): string | null {
    return this.id ? `${this.id}-error` : null;
  }

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.valueChange.emit(value);
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
    this.blur.emit();
  }
}
