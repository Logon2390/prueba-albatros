import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '@app/shared/components/button/button';

@Component({
  selector: 'app-empty-state',
  imports: [CommonModule, Button],
  templateUrl: './empty-state.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class EmptyState {
  title = input.required<string>();
  description = input<string>('');
  icon = input<string>('icon-[lucide--circle-alert]');
  actionText = input<string>('');
  actionVariant = input<'primary' | 'secondary' | 'outline' | 'ghost'>('primary');
  action = output<void>();

  onAction(): void {
    this.action.emit();
  }
}
