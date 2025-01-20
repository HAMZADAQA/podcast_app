import { formatDuration } from './formatUtils';

describe('formatDuration Utility', () => {
  it('formats durations less than one minute correctly', () => {
    const result = formatDuration(45000); // 45 seconds
    expect(result).toBe('0:45');
  });

  it('formats durations exactly one minute correctly', () => {
    const result = formatDuration(60000); // 1 minute
    expect(result).toBe('1:00');
  });

  it('formats durations greater than one minute correctly', () => {
    const result = formatDuration(125000); // 2 minutes and 5 seconds
    expect(result).toBe('2:05');
  });

  it('formats durations with single-digit seconds correctly', () => {
    const result = formatDuration(61000); // 1 minute and 1 second
    expect(result).toBe('1:01');
  });

  it('formats durations with zero seconds correctly', () => {
    const result = formatDuration(120000); // 2 minutes
    expect(result).toBe('2:00');
  });
});
