import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.html',
})
export class User {
  @Input() name: string = 'Anonymous';
  initials(): string {
    const parts = this.name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? 'A';
    const second = parts[1]?.[0] ?? '';
    return `${first}${second}`.toUpperCase();
  }
}
