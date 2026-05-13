import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { Button } from '@app/shared/components/button/button';
import { Modal } from '@app/shared/components/modal/modal';

@Component({
  selector: 'app-delete-post-modal',
  imports: [Modal, Button],
  templateUrl: './delete-post-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeletePostModal {
  readonly confirm = output<void>();
  readonly closed = output<void>();
  readonly isOpen = signal(false);

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this.closed.emit();
  }

  onClose(): void {
    this.close();
  }

  onConfirm(): void {
    this.confirm.emit();
  }
}
