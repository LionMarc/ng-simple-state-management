import { take } from 'rxjs';
import { LogEvent } from './log-event';
import { LogLevel } from './log-level';
import { Logger } from './logger';

describe('Logger', () => {
  [LogLevel.debug, LogLevel.information, LogLevel.error].forEach((level) => {
    it(`should publish a ${level} message`, () => {
      const logger = new Logger();
      let logEvent: LogEvent | undefined;
      logger.logEvents$.pipe(take(1)).subscribe((e) => (logEvent = e));

      switch (level) {
        case LogLevel.debug:
          logger.debug('Testing message', { title: 'test of payload' });
          break;

        case LogLevel.error:
          logger.error('Testing message', { title: 'test of payload' });
          break;

        case LogLevel.information:
          logger.information('Testing message', { title: 'test of payload' });
          break;
      }

      expect(logEvent).toBeDefined();
      expect(logEvent?.level).toBe(level);
      expect(logEvent?.message).toBe('Testing message');
      expect(logEvent?.payload).toEqual({ title: 'test of payload' });
    });
  });
});
