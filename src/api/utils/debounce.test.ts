import { debounce } from './debounce';

jest.useFakeTimers();

describe('debounce Utility', () => {
  it('calls the function after the specified delay', () => {
    const mockFunction = jest.fn();
    const debouncedFunction = debounce(mockFunction, 300);

    debouncedFunction();
    expect(mockFunction).not.toHaveBeenCalled();

    jest.advanceTimersByTime(300);
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  it('calls the function with the correct arguments', () => {
    const mockFunction = jest.fn();
    const debouncedFunction = debounce(mockFunction, 300);

    debouncedFunction('arg1', 'arg2');
    jest.advanceTimersByTime(300);

    expect(mockFunction).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('resets the timer if called again within the delay', () => {
    const mockFunction = jest.fn();
    const debouncedFunction = debounce(mockFunction, 300);

    debouncedFunction();
    jest.advanceTimersByTime(200);
    debouncedFunction();
    jest.advanceTimersByTime(200);

    expect(mockFunction).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  it('calls the function only once when invoked multiple times within the delay', () => {
    const mockFunction = jest.fn();
    const debouncedFunction = debounce(mockFunction, 300);

    debouncedFunction();
    debouncedFunction();
    debouncedFunction();
    jest.advanceTimersByTime(300);

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });
});
