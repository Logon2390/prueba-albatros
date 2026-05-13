import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pointer-events-none fixed inset-0 z-[60]'
  },
})
export class Modal {
  open = input(false);
  title = input<string>('');
  description = input<string>('');
  closeOnBackdrop = input(true);
  showClose = input(true);

  closed = output<void>();

  readonly visible = signal(false);
  readonly closing = signal(false);
  private closeTimer: number | null = null;
  private readonly animationMs = 220;

  constructor() {
    effect(() => {
      if (this.open()) {
        this.show();
      } else if (this.visible()) {
        this.startClose();
      }
    });
  }

  requestClose(): void {
    this.closed.emit();
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.requestClose();
    }
  }

  onEscape(): void {
    if (this.open()) {
      this.requestClose();
    }
  }

  private show(): void {
    if (this.closeTimer) {
      window.clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
    this.visible.set(true);
    this.closing.set(false);
  }

  private startClose(): void {
    if (this.closing()) return;
    
    this.closing.set(true);
    if (this.closeTimer) {
      window.clearTimeout(this.closeTimer);
    }
    
    this.closeTimer = window.setTimeout(() => {
      this.visible.set(false);
      this.closing.set(false);
      this.closeTimer = null;
    }, this.animationMs);
  }
}
