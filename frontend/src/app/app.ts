import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '@shared/components/navbar/navbar';
import { NotificationList } from '@shared/components/notification/notification-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, NotificationList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
