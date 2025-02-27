import { mockHttpErrorResponse } from '../services/__mocks__/podcastMocks';

describe('apiClient buildUrl in DEV mode', () => {
  const originalEnv = { ...import.meta.env };
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    process.env.NODE_ENV = 'test';
    Object.defineProperty(import.meta, 'env', {
      get: () => ({ DEV: true, VITE_API_BASE_URL: 'https://itunes.apple.com' }),
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(import.meta, 'env', {
      get: () => originalEnv,
      configurable: true,
    });
    process.env.NODE_ENV = originalNodeEnv;
    jest.resetModules();
  });

  it('returns endpoint in DEV mode', () => {
    const { buildUrl } = require('./apiClient');
    const result = buildUrl('https://itunes.apple.com', '/lookup?id=123');
    expect(result).toBe('/lookup?id=123');
  });
});

describe('apiClient buildUrl in production mode', () => {
  const originalEnv = { ...import.meta.env };
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    process.env.NODE_ENV = 'production';
    Object.defineProperty(import.meta, 'env', {
      get: () => ({
        DEV: false,
        VITE_API_BASE_URL: 'https://itunes.apple.com',
      }),
      configurable: true,
    });
    jest.resetModules();
  });

  afterEach(() => {
    Object.defineProperty(import.meta, 'env', {
      get: () => originalEnv,
      configurable: true,
    });
    process.env.NODE_ENV = originalNodeEnv;
    jest.resetModules();
  });

  it('uses cors proxy for /lookup endpoints in production', () => {
    const { buildUrl } = require('./apiClient');
    const endpoint = '/lookup?id=123';
    const result = buildUrl('https://itunes.apple.com', endpoint);
    expect(result).toContain('https://corsproxy.io/?url=');
  });

  it('appends &limit=20 if not present for lookup endpoints', () => {
    const { buildUrl } = require('./apiClient');
    const endpoint = '/lookup?id=123';
    const result = buildUrl('https://itunes.apple.com', endpoint);
    expect(result).toMatch(/&limit=20$/);
  });
});

describe('apiClient', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('throws an error if response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockHttpErrorResponse);
    const { apiClient } = require('./apiClient');
    await expect(apiClient('/test')).rejects.toThrow('HTTP error! Status: 404');
  });

  it('returns parsed JSON response', async () => {
    const fakeResponse = { message: 'success' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => fakeResponse,
    });
    const { apiClient } = require('./apiClient');
    const result = await apiClient('/test');
    expect(result).toEqual(fakeResponse);
  });

  it('parses wrapped JSON if contents field exists', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ contents: JSON.stringify({ wrapped: true }) }),
    });
    const { apiClient } = require('./apiClient');
    const result = await apiClient('/test');
    expect(result).toEqual({ wrapped: true });
  });
});
