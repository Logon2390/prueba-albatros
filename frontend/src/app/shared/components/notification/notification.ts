import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  templateUrl: './notification.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Notification {
  type = input<NotificationType>('info');
  message = input<string>('');

  readonly iconName = computed(() => {
    const map: Record<NotificationType, string> = {
      success: 'icon-[lucide--check-circle]',
      info: 'icon-[lucide--info]',
      warning: 'icon-[lucide--alert-triangle]',
      error: 'icon-[lucide--x-circle]',
    };
    return map[this.type()];
  });

  readonly containerClasses = computed(() => {
    const base = 'bg-white';
    const map: Record<NotificationType, string> = {
      success: 'border-emerald-200 bg-emerald-50/80',
      info: 'border-sky-200 bg-sky-50/80',
      warning: 'border-amber-200 bg-amber-50/80',
      error: 'border-rose-200 bg-rose-50/80',
    };
    return `${base} ${map[this.type()]}`;
  });

  readonly iconWrapperClasses = computed(() => {
    const map: Record<NotificationType, string> = {
      success: 'bg-emerald-100 text-emerald-600',
      info: 'bg-sky-100 text-sky-600',
      warning: 'bg-amber-100 text-amber-600',
      error: 'bg-rose-100 text-rose-600',
    };
    return map[this.type()];
  });

  readonly messageClasses = computed(() => {
    const map: Record<NotificationType, string> = {
      success: 'text-emerald-900',
      info: 'text-sky-900',
      warning: 'text-amber-900',
      error: 'text-rose-900',
    };
    return map[this.type()];
  });
}
