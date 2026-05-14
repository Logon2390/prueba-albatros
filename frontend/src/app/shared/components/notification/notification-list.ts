import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '@app/core/services/notification.service';
import { Notification } from './notification';

@Component({
  selector: 'app-notification-list',
  imports: [CommonModule, Notification],
  templateUrl: './notification-list.html',
  styleUrl: './notification-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pointer-events-none fixed right-5 top-24 z-[70]'
  }
})
export class NotificationList {
  private readonly notificationService = inject(NotificationService);

  readonly notifications = this.notificationService.notifications;
  readonly visibleNotifications = computed(() => this.notifications().slice(0, 3));
}
