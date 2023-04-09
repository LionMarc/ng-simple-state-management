import { Injectable } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Logger } from './logger';
import { LogLevel } from './log-level';

@Injectable({
  providedIn: 'root'
})
export class ConsoleAppender {
  private readonly stopEvent$ = new Subject<boolean>();

  constructor(private logger: Logger) {}

  public start(): void {
    this.logger.logEvents$.pipe(takeUntil(this.stopEvent$)).subscribe((logEvent) => {
      let logFunction: any;
      switch (logEvent.level) {
        case LogLevel.error:
          logFunction = console.error;
          break;

        default:
          logFunction = console.log;
          break;
      }

      if (logEvent.payload) {
        logFunction(`[${logEvent.level}] ${logEvent.message}`, logEvent.payload);
      } else {
        logFunction(`[${logEvent.level}] ${logEvent.message}`);
      }
    });
  }

  public stop(): void {
    this.stopEvent$.next(true);
  }
}
