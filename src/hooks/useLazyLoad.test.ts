import { renderHook } from '@testing-library/react';
import useLazyLoad from './useLazyLoad';

describe('useLazyLoad', () => {
  beforeAll(() => {
    global.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as any;
  });

  it('returns a ref and inView defaults to false', () => {
    const { result } = renderHook(() => useLazyLoad());
    expect(result.current.ref.current).toBe(null);
    expect(result.current.inView).toBe(false);
  });
});
