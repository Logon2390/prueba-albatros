import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-text-area',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './text-area.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppTextArea),
      multi: true,
    },
  ],
})
export class AppTextArea implements ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() className: string = '';
  @Input() error: boolean = false;
  @Input() errorText: string = '';
  @Input() disabled: boolean = false;
  @Input() rows: number = 3;
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
    const nextValue = (event.target as HTMLTextAreaElement).value;
    this.value = nextValue;
    this.valueChange.emit(nextValue);
    this.onChange(nextValue);
  }

  onBlur(): void {
    this.onTouched();
  }
}
