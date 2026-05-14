import { Injectable, signal } from '@angular/core';
import { NotificationType } from '@shared/components/notification/notification';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
  durationMs: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly items = signal<NotificationItem[]>([]);
  readonly notifications = this.items.asReadonly();

  private readonly defaultDurationMs = 3200;
  private readonly maxVisible = 3;

  show(type: NotificationType, message: string, durationMs = this.defaultDurationMs): void {
    const id = crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const item: NotificationItem = { id, type, message, durationMs };
    this.items.update((current) => {
      const next = [item, ...current];
      return next;
    });

    window.setTimeout(() => {
      this.remove(id);
    }, durationMs);
  }

  remove(id: string): void {
    this.items.update((current) => current.filter((item) => item.id !== id));
  }
}
