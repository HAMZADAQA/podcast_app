import { apiClient } from './apiClient';

global.fetch = jest.fn();

describe('apiClient', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch data from the correct URL', async () => {
    const endpoint = '/test-endpoint';
    const mockResponse = { success: true };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await apiClient(endpoint);

    expect(fetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_BASE_URL || '/api'}${endpoint}`,
      {}
    );
    expect(result).toEqual(mockResponse);
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

    const result = await apiClient(endpoint, options);

    expect(fetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_BASE_URL || '/api'}${endpoint}`,
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

    await expect(apiClient(endpoint)).rejects.toThrow(
      'HTTP error! status: 404'
    );
  });

  it('should throw an error if fetch fails', async () => {
    const endpoint = '/test-endpoint';
    const mockError = new Error('Network error');

    (fetch as jest.Mock).mockRejectedValueOnce(mockError);

    await expect(apiClient(endpoint)).rejects.toThrow('Network error');
  });

  it('should handle cases where BASE_URL is not defined', async () => {
    const endpoint = 'http://external-api.com/test-endpoint';
    const mockResponse = { success: true };
    const originalBaseUrl = import.meta.env.VITE_API_BASE_URL;

    import.meta.env.VITE_API_BASE_URL = '';

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await apiClient(endpoint);

    expect(fetch).toHaveBeenCalledWith(
      `https://api.allorigins.win/get${endpoint}`,
      {}
    );
    expect(result).toEqual(mockResponse);

    import.meta.env.VITE_API_BASE_URL = originalBaseUrl;
  });

  it('should throw an error if response JSON parsing fails', async () => {
    const endpoint = '/test-endpoint';
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON');
      },
    });

    await expect(apiClient(endpoint)).rejects.toThrow(
      'Failed to parse JSON response'
    );
  });

  it('should throw an error if the endpoint is empty', async () => {
    const endpoint = '';

    await expect(apiClient(endpoint)).rejects.toThrow(
      'Endpoint cannot be empty'
    );
  });
});
