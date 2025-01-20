const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Fetch data from the configured API.
 * @param endpoint - Relative endpoint (e.g., `/us/rss/toppodcasts/limit=100/genre=1310/json`).
 * @param options - Additional fetch options.
 * @returns Parsed JSON response.
 */
export const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  if (!endpoint) {
    throw new Error('Endpoint cannot be empty');
  }

  const url = BASE_URL ? `${BASE_URL}${endpoint}` : endpoint;

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    try {
      return await response.json();
    } catch (error) {
      console.error('[API Client] Failed to parse JSON response:', error);
      throw new Error('Failed to parse JSON response');
    }
  } catch (error) {
    console.error('[API Client] Error:', error);
    throw error;
  }
};
