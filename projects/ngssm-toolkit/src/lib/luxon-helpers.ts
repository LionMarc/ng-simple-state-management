import { DateTime } from 'luxon';

export const compareDateTime = (left: DateTime, right: DateTime): number => {
  if (left < right) {
    return -1;
  }

  if (left > right) {
    return 1;
  }

  return 0;
};

export const toUtcDate = (value: string): DateTime => DateTime.fromISO(value, { zone: 'utc' });
