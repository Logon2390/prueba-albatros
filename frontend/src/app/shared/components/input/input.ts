import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input.html',
})
export class AppInput {
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Input() type: string = 'text';
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() className: string = '';
  @Output() valueChange = new EventEmitter<string>();
}
