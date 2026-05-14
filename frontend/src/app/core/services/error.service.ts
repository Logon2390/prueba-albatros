import { Injectable, signal } from '@angular/core';
import { NotificationService } from './notification.service';

export interface AppError {
  message: string;
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class ErrorService {
  constructor(private notificationService: NotificationService) {}
  handle(message: string): void {
    this.notificationService.show('error', message);
    console.error(`[${new Date().toISOString()}] ${message}`);
  }
}


