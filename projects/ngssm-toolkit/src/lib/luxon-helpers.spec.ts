import { DateTime } from 'luxon';
import { compareDateTime } from './luxon-helpers';

describe('Luxon helpers', () => {
  describe('compareDateTime', () => {
    it(`should return -1 when left is before right`, () => {
      const left = DateTime.fromISO('2023-06-04T23:45:00Z');
      const right = DateTime.fromISO('2023-06-05T23:45:00Z');

      const result = compareDateTime(left, right);

      expect(result).toEqual(-1);
    });

    it(`should return 1 when left is after right`, () => {
      const left = DateTime.fromISO('2023-06-06T23:45:00Z');
      const right = DateTime.fromISO('2023-06-05T23:45:00Z');

      const result = compareDateTime(left, right);

      expect(result).toEqual(1);
    });

    it(`should return 0 when left is equal to right`, () => {
      const left = DateTime.fromISO('2023-06-05T23:45:00Z');
      const right = DateTime.fromISO('2023-06-05T23:45:00Z');

      const result = compareDateTime(left, right);

      expect(result).toEqual(0);
    });
  });
});
