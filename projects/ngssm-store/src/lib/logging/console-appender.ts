import { inject, Injectable } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Logger } from './logger';
import { LogLevel } from './log-level';

const logLevelOrder: Record<LogLevel, number> = {
  [LogLevel.debug]: 0,
  [LogLevel.information]: 1,
  [LogLevel.error]: 2
};

@Injectable({
  providedIn: 'root'
})
export class ConsoleAppender {
  private logger = inject(Logger);

  private readonly stopEvent$ = new Subject<boolean>();

  public start(contextName?: string, minimumLogLevel: LogLevel = LogLevel.debug): void {
    this.logger.logEvents$.pipe(takeUntil(this.stopEvent$)).subscribe((logEvent) => {
      if (logLevelOrder[logEvent.level] < logLevelOrder[minimumLogLevel]) {
        return;
      }

      let logFunction: (...data: unknown[]) => void;
      switch (logEvent.level) {
        case LogLevel.error:
          logFunction = console.error;
          break;

        default:
          logFunction = console.log;
          break;
      }

      const now = new Date().toLocaleString();
      const prefix = contextName ? `[${contextName}] ` : '';

      if (logEvent.payload) {
        logFunction(`${prefix}[${now}] [${logEvent.level}] ${logEvent.message}`, logEvent.payload);
      } else {
        logFunction(`${prefix}[${now}] [${logEvent.level}] ${logEvent.message}`);
      }
    });
  }

  public stop(): void {
    this.stopEvent$.next(true);
  }
}
