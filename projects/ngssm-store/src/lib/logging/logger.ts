import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { LogEvent } from './log-event';
import { LogLevel } from './log-level';

@Injectable({
  providedIn: 'root'
})
export class Logger {
  private readonly _logEvents$ = new Subject<LogEvent>();

  public get logEvents$(): Observable<LogEvent> {
    return this._logEvents$.asObservable();
  }

  public debug(message: string, payload?: unknown): void {
    this.log(LogLevel.debug, message, payload);
  }

  public information(message: string, payload?: unknown): void {
    this.log(LogLevel.information, message, payload);
  }

  public error(message: string, payload?: unknown): void {
    this.log(LogLevel.error, message, payload);
  }

  public log(level: LogLevel, message: string, payload?: unknown): void {
    this._logEvents$.next({
      level,
      message,
      payload
    });
  }
}
