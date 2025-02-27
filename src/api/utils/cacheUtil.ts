export const setCache = (
  key: string,
  data: any,
  timestamp: number = Date.now()
): void => {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp }));
  } catch (error) {
    console.warn(`Error setting cache for key ${key}:`, error);
  }
};

export const getCache = (
  key: string
): { data: any; timestamp: number } | null => {
  try {
    const cached = localStorage.getItem(key);
    if (cached) return JSON.parse(cached);
  } catch (error) {
    console.warn(`Error getting cache for key ${key}:`, error);
  }
  return null;
};

export const isCacheValid = (timestamp: number, expiry: number): boolean => {
  return Date.now() - timestamp < expiry;
};
