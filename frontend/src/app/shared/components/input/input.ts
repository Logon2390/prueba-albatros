import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Input() type: string = 'text';
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() className: string = '';
  @Input() error: boolean = false;
  @Input() errorText: string = '';
  @Input() disabled: boolean = false;
  @Output() valueChange = new EventEmitter<string>();

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
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const nextValue = (event.target as HTMLInputElement).value;
    this.value = nextValue;
    this.valueChange.emit(nextValue);
    this.onChange(nextValue);
  }

  onBlur(): void {
    this.onTouched();
  }
}
