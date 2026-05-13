import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Button } from '../button/button';

export interface NavItem {
  label: string;
  route?: string;
  active?: boolean;
}

@Component({
  selector: 'app-navbar',
  imports: [Button, CommonModule, FormsModule],
  templateUrl: './navbar.html',
})
export class Navbar {
  @Input() title: string = 'Post';
  @Input() buttonText: string = 'Nuevo Post';
  @Input() buttonIcon: string = 'icon-[lucide--plus]';

  onCreateClick(): void {
    console.log('Create clicked');
  }
}