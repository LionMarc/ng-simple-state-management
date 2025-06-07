import { inject, Injectable } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Logger } from './logger';
import { LogLevel } from './log-level';

@Injectable({
  providedIn: 'root'
})
export class ConsoleAppender {
  private logger = inject(Logger);

  private readonly stopEvent$ = new Subject<boolean>();

  public start(contextName?: string): void {
    this.logger.logEvents$.pipe(takeUntil(this.stopEvent$)).subscribe((logEvent) => {
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
