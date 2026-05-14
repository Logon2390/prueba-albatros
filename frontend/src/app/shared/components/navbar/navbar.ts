import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@app/features/home/services/auth.service';
import { User } from '../user/user';
import { Button } from '../button/button';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, User, Button],
  templateUrl: './navbar.html',
})
export class Navbar {
  @Input() title = 'Post App';
  private readonly authService = inject(AuthService);

  readonly userName = this.authService.userName;
  readonly isLoggedIn = this.authService.isLoggedIn;

  onLogout(): void {
    this.authService.logout();
  }
}