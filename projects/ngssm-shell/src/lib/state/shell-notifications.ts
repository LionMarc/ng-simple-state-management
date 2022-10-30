import { ShellNotification } from '../model';

export interface ShellNotifications {
  notifications: ShellNotification[];
  selectedNotificaitonIndex?: number;
}

export const getDefaultShellNotifications = (): ShellNotifications => ({
  notifications: []
});
