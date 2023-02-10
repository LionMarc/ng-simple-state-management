import { LogLevel } from './log-level';

export interface LogEvent {
  level: LogLevel;
  message: string;
  payload?: any;
}
