import { ShellNotificationType } from './shell-notification-type';

export interface ShellNotification {
  type: ShellNotificationType;
  title: string;
  timestamp: Date;
  details?: unknown;
}
