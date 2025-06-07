import { TestBed } from '@angular/core/testing';
import { ConsoleAppender } from './console-appender';
import { Logger } from './logger';

describe('ConsoleAppender', () => {
  let appender: ConsoleAppender;
  let logger: Logger;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    logger = TestBed.inject(Logger);
    appender = TestBed.inject(ConsoleAppender);
  });

  describe('when appender is started', () => {
    beforeEach(() => {
      appender.start();
    });

    it('should display a message in the console when an info LogEvent is emitted', () => {
      spyOn(console, 'log');

      logger.information('Testing message');

      expect(console.log).toHaveBeenCalled();
    });

    describe('After appender is stopped', () => {
      beforeEach(() => {
        appender.stop();
      });

      it('should not display a message in the console when an info LogEvent is emitted', () => {
        spyOn(console, 'log');

        logger.information('Testing message');

        expect(console.log).not.toHaveBeenCalled();
      });
    });
  });
});
