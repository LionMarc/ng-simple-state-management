import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders, inject, provideAppInitializer } from '@angular/core';
import { ConsoleAppender } from './console-appender';
import { LogLevel } from './log-level';

export const NGSSM_CONSOLE_APPENDER_NAME = new InjectionToken<string>('NGSSM_CONSOLE_APPENDER_NAME');
export const NGSSM_CONSOLE_APPENDER_MINIMUM_LOG_LEVEL = new InjectionToken<LogLevel>('NGSSM_CONSOLE_APPENDER_MINIMUM_LOG_LEVEL');

export const startConsoleAppenderFactory = (): (() => void) => {
  return () => {
    const name = inject(NGSSM_CONSOLE_APPENDER_NAME);
    const minimumLogLevel = inject(NGSSM_CONSOLE_APPENDER_MINIMUM_LOG_LEVEL);
    const consoleAppender = inject(ConsoleAppender);
    consoleAppender.start(name, minimumLogLevel);
  };
};

export const provideConsoleAppender = (name: string, minimumLogLevel: LogLevel = LogLevel.debug): EnvironmentProviders => {
  return makeEnvironmentProviders([
    {
      provide: NGSSM_CONSOLE_APPENDER_NAME,
      useValue: name
    },
    {
      provide: NGSSM_CONSOLE_APPENDER_MINIMUM_LOG_LEVEL,
      useValue: minimumLogLevel
    },
    provideAppInitializer(startConsoleAppenderFactory())
  ]);
};
