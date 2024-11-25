import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders, inject, provideAppInitializer } from '@angular/core';
import { ConsoleAppender } from './console-appender';

export const NGSSM_CONSOLE_APPENDER_NAME = new InjectionToken<string>('NGSSM_CONSOLE_APPENDER_NAME');

export const startConsoleAppenderFactory = (): (() => void) => {
  return () => {
    const name = inject(NGSSM_CONSOLE_APPENDER_NAME);
    const consoleAppender = inject(ConsoleAppender);
    consoleAppender.start(name);
  };
};

export const provideConsoleAppender = (name: string): EnvironmentProviders => {
  return makeEnvironmentProviders([
    {
      provide: NGSSM_CONSOLE_APPENDER_NAME,
      useValue: name
    },
    provideAppInitializer(startConsoleAppenderFactory())
  ]);
};
