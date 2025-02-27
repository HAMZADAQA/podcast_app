import { formatDuration } from './formatUtils';

describe('formatDuration', () => {
  it('returns "0:00" for 0 milliseconds', () => {
    expect(formatDuration(0)).toBe('0:00');
  });

  it('formats durations under one hour with mm:ss (with leading zero for seconds)', () => {
    expect(formatDuration(62000)).toBe('1:02');

    expect(formatDuration(75000)).toBe('1:15');

    expect(formatDuration(3599000)).toBe('59:59');
  });

  it('formats durations of one hour or more as "X hr Y min"', () => {
    expect(formatDuration(3600000)).toBe('1 hr 0 min');

    expect(formatDuration(4500000)).toBe('1 hr 15 min');

    expect(formatDuration(7200000)).toBe('2 hr 0 min');
  });
});
