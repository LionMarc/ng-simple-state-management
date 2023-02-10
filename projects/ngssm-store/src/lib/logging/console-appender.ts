import { Injectable } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Logger } from './logger';

@Injectable({
  providedIn: 'root'
})
export class ConsoleAppender {
  private readonly stopEvent$ = new Subject<boolean>();

  constructor(private logger: Logger) {}

  public start(): void {
    this.logger.logEvents$.pipe(takeUntil(this.stopEvent$)).subscribe((logEvent) => {
      if (logEvent.payload) {
        console.log(`[${logEvent.level}] ${logEvent.message}`, logEvent.payload);
      } else {
        console.log(`[${logEvent.level}] ${logEvent.message}`);
      }
    });
  }

  public stop(): void {
    this.stopEvent$.next(true);
  }
}
