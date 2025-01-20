import { getCachedData, setCachedData } from './cacheUtil';

describe('Cache Utils', () => {
  const TEST_KEY = 'test_key';
  const TEST_VALUE = { foo: 'bar' };
  const CACHE_DURATION = 1000; // 1 second

  beforeEach(() => {
    localStorage.clear();
  });

  it('should store and retrieve data correctly in development mode', () => {
    // Mock the environment as development
    (import.meta.env as any).MODE = 'development';

    setCachedData(TEST_KEY, TEST_VALUE);

    const cachedData = getCachedData<typeof TEST_VALUE>(
      TEST_KEY,
      CACHE_DURATION
    );
    expect(cachedData).toEqual(TEST_VALUE);
  });

  it('should return null for expired cache in development mode', () => {
    // Mock the environment as development
    (import.meta.env as any).MODE = 'development';

    setCachedData(TEST_KEY, TEST_VALUE);

    // Simulate expiration by manipulating Date
    jest
      .spyOn(global.Date, 'now')
      .mockImplementationOnce(() => Date.now() + CACHE_DURATION + 1);

    const cachedData = getCachedData<typeof TEST_VALUE>(
      TEST_KEY,
      CACHE_DURATION
    );
    expect(cachedData).toBeNull();
  });

  it('should encrypt and decrypt data correctly in production mode', () => {
    // Mock the environment as production
    (import.meta.env as any).MODE = 'production';
    (import.meta.env as any).VITE_SECRET_KEY = 'test_secret_key';

    setCachedData(TEST_KEY, TEST_VALUE);

    const encryptedValue = localStorage.getItem(TEST_KEY);
    expect(encryptedValue).not.toBeNull();
    expect(encryptedValue).not.toEqual(JSON.stringify(TEST_VALUE)); // Ensure it's encrypted

    const cachedData = getCachedData<typeof TEST_VALUE>(
      TEST_KEY,
      CACHE_DURATION
    );
    expect(cachedData).toEqual(TEST_VALUE);
  });

  it('should return null for invalid or corrupted data in production mode', () => {
    // Mock the environment as production
    (import.meta.env as any).MODE = 'production';
    (import.meta.env as any).VITE_SECRET_KEY = 'test_secret_key';

    localStorage.setItem(TEST_KEY, 'corrupted_value');

    const cachedData = getCachedData<typeof TEST_VALUE>(
      TEST_KEY,
      CACHE_DURATION
    );
    expect(cachedData).toBeNull();
  });

  it('should return null for expired cache in production mode', () => {
    // Mock the environment as production
    (import.meta.env as any).MODE = 'production';
    (import.meta.env as any).VITE_SECRET_KEY = 'test_secret_key';

    setCachedData(TEST_KEY, TEST_VALUE);

    // Simulate expiration by manipulating Date
    jest
      .spyOn(global.Date, 'now')
      .mockImplementationOnce(() => Date.now() + CACHE_DURATION + 1);

    const cachedData = getCachedData<typeof TEST_VALUE>(
      TEST_KEY,
      CACHE_DURATION
    );
    expect(cachedData).toBeNull();
  });
});
