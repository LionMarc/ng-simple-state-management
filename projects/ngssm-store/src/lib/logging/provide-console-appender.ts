import { APP_INITIALIZER, EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { ConsoleAppender } from './console-appender';

export const NGSSM_CONSOLE_APPENDER_NAME = new InjectionToken<string>('NGSSM_CONSOLE_APPENDER_NAME');

export const startConsoleAppenderFactory = (name: string, consoleAppender: ConsoleAppender): (() => void) => {
  return () => {
    consoleAppender.start(name);
  };
};

export const provideConsoleAppender = (name: string): EnvironmentProviders => {
  return makeEnvironmentProviders([
    {
      provide: NGSSM_CONSOLE_APPENDER_NAME,
      useValue: name
    },
    {
      provide: APP_INITIALIZER,
      useFactory: startConsoleAppenderFactory,
      deps: [NGSSM_CONSOLE_APPENDER_NAME, ConsoleAppender],
      multi: true
    }
  ]);
};
