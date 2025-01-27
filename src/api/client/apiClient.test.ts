import { apiClient } from './apiClient';

global.fetch = jest.fn();

describe('apiClient', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch data from the correct URL when using a direct API call', async () => {
    const endpoint = '/test-endpoint';
    const mockResponse = { success: true };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await apiClient(endpoint, {}, '/api');

    expect(fetch).toHaveBeenCalledWith('/api/test-endpoint', {});
    expect(result).toEqual(mockResponse);
  });

  it('should fetch data from the correct URL when using allorigins.win proxy', async () => {
    const endpoint = '/test-endpoint';
    const mockResponse = { contents: JSON.stringify({ success: true }) };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await apiClient(
      endpoint,
      {},
      'https://api.allorigins.win/get'
    );

    expect(fetch).toHaveBeenCalledWith(
      'https://api.allorigins.win/get?url=https%3A%2F%2Fitunes.apple.com%2Ftest-endpoint',
      {}
    );
    expect(result).toEqual({ success: true });
  });

  it('should include additional fetch options when provided', async () => {
    const endpoint = '/test-endpoint';
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'value' }),
    };
    const mockResponse = { success: true };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await apiClient(
      endpoint,
      options,
      'https://api.allorigins.win/get'
    );

    expect(fetch).toHaveBeenCalledWith(
      'https://api.allorigins.win/get?url=https%3A%2F%2Fitunes.apple.com%2Ftest-endpoint',
      options
    );
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error for non-OK responses', async () => {
    const endpoint = '/test-endpoint';

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(
      apiClient(endpoint, {}, 'https://api.allorigins.win/get')
    ).rejects.toThrow('HTTP error! Status: 404');
  });

  it('should correctly parse contents from allorigins.win proxy', async () => {
    const endpoint = '/test-endpoint';
    const mockResponse = { contents: JSON.stringify({ success: true }) };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await apiClient(
      endpoint,
      {},
      'https://api.allorigins.win/get'
    );

    expect(fetch).toHaveBeenCalledWith(
      'https://api.allorigins.win/get?url=https%3A%2F%2Fitunes.apple.com%2Ftest-endpoint',
      {}
    );
    expect(result).toEqual({ success: true });
  });

  it('should throw an error if response JSON parsing fails', async () => {
    const endpoint = '/test-endpoint';

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON');
      },
    });

    await expect(
      apiClient(endpoint, {}, 'https://api.allorigins.win/get')
    ).rejects.toThrow('Invalid JSON');
  });

  it('should throw an error if the endpoint is empty', async () => {
    await expect(apiClient('', {}, '/api')).rejects.toThrow(
      'Endpoint cannot be empty'
    );
  });
});
