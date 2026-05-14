import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
})
export class Button {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() text: string = '';
  @Input() icon: string = '';
  @Input() iconColor: string = '';
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() fullWidth: boolean = false;
  @Input() isActive: boolean = false;
  @Output() onClick = new EventEmitter<void>();

  handleClick(): void {
    if (!this.disabled) {
      this.onClick.emit();
    }
  }

  get iconClasses(): string {
    const classes = [`${this.icon}`];
    const sizeMap: Record<ButtonSize, string> = { 
      sm: 'text-base', 
      md: 'text-xl', 
      lg: 'text-2xl' 
    };
    classes.push(sizeMap[this.size]);
    return classes.join(' ');
  }
}