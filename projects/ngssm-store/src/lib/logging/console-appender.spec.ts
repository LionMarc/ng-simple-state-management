import { TestBed } from '@angular/core/testing';
import { ConsoleAppender } from './console-appender';
import { Logger } from './logger';
import { LogLevel } from './log-level';

describe('ConsoleAppender', () => {
  let appender: ConsoleAppender;
  let logger: Logger;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    logger = TestBed.inject(Logger);
    appender = TestBed.inject(ConsoleAppender);
    vi.restoreAllMocks();
  });

  describe('when appender is started', () => {
    beforeEach(() => {
      appender.start();
    });

    it('should display a message in the console when an info LogEvent is emitted', () => {
      vi.spyOn(console, 'log');

      logger.information('Testing message');

      expect(console.log).toHaveBeenCalled();
    });

    describe('After appender is stopped', () => {
      beforeEach(() => {
        appender.stop();
      });

      it('should not display a message in the console when an info LogEvent is emitted', () => {
        vi.spyOn(console, 'log');

        logger.information('Testing message');

        expect(console.log).not.toHaveBeenCalled();
      });
    });
  });

  describe('when appender has a minimum log level', () => {
    beforeEach(() => {
      appender.start(undefined, LogLevel.information);
    });

    it('should ignore messages below the minimum log level', () => {
      vi.spyOn(console, 'log');

      logger.debug('Debug message');

      expect(console.log).not.toHaveBeenCalled();
    });

    it('should display messages at or above the minimum log level', () => {
      vi.spyOn(console, 'log');
      vi.spyOn(console, 'error');

      logger.information('Information message');
      logger.error('Error message');

      expect(console.log).toHaveBeenCalledOnce();
      expect(console.error).toHaveBeenCalledOnce();
    });
  });
});
