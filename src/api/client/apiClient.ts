/**
 * Build the full URL for the API request.
 * Handles proxy logic for allorigins.win.
 * @param baseUrl - The base URL of the API.
 * @param endpoint - The relative API endpoint.
 * @returns The full URL for the API request.
 */
export const buildUrl = (baseUrl: string, endpoint: string): string => {
  if (import.meta.env.DEV || process.env.NODE_ENV === 'test') {
    return endpoint;
  }

  if (endpoint.startsWith('/lookup')) {
    const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(`${baseUrl}${endpoint}`)}`;
    if (!endpoint.includes('limit=20')) {
      return proxyUrl + '&limit=20';
    }
    return proxyUrl;
  }

  return `${baseUrl}${endpoint}`;
};

/**
 * Centralized function to fetch data from the API.
 * @param endpoint - The relative API endpoint.
 * @param options - Additional fetch options (e.g., headers, body).
 * @param baseUrl - Optional base URL for overriding (used in tests or dynamic cases).
 * @returns Parsed JSON response.
 */
export const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {},
  baseUrl?: string
): Promise<T> => {
  if (!endpoint) {
    throw new Error('Endpoint cannot be empty');
  }

  const BASE_URL =
    baseUrl || import.meta.env.VITE_API_BASE_URL || 'https://itunes.apple.com';
  const url = buildUrl(BASE_URL, endpoint);

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const rawData = await response.json();
    return rawData.contents ? JSON.parse(rawData.contents) : rawData;
  } catch (error) {
    console.error('[API Client] Error:', error);
    throw error;
  }
};
