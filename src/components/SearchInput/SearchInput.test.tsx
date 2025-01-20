// SearchBar.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchInput';
import * as debounceUtils from '@/api/utils/debounce';

jest.mock('@/api/utils/debounce', () => ({
  debounce: jest.fn((fn: (...args: any[]) => void) => fn),
}));

describe('SearchBar Component', () => {
  it('renders the input field', () => {
    render(<SearchBar onSearch={jest.fn()} />);
    const inputElement = screen.getByPlaceholderText('Filter podcasts...');
    expect(inputElement).toBeInTheDocument();
  });

  it('calls onSearch when input value changes', () => {
    const onSearchMock = jest.fn();
    render(<SearchBar onSearch={onSearchMock} />);

    const inputElement = screen.getByPlaceholderText('Filter podcasts...');
    fireEvent.change(inputElement, { target: { value: 'test' } });

    expect(onSearchMock).toHaveBeenCalledWith('test');
  });

  it('uses the debounce function', () => {
    const onSearchMock = jest.fn();
    const debounceSpy = jest.spyOn(debounceUtils, 'debounce');

    render(<SearchBar onSearch={onSearchMock} />);
    const inputElement = screen.getByPlaceholderText('Filter podcasts...');
    fireEvent.change(inputElement, { target: { value: 'debounce test' } });

    // Check if debounce is called with the function and delay
    expect(debounceSpy).toHaveBeenCalledWith(expect.any(Function), 300);
  });
});
