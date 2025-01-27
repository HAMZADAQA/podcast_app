import CryptoJS from 'crypto-js';

const IS_PRODUCTION = import.meta.env.MODE === 'production';
const SECRET_KEY = IS_PRODUCTION ? import.meta.env.VITE_SECRET_KEY : null;

/**
 * Encrypt data using AES encryption.
 */
const encrypt = (data: string): string => {
  if (!IS_PRODUCTION) return data; // Skip encryption in development
  if (!SECRET_KEY) {
    throw new Error(
      '[CacheUtils] Missing SECRET_KEY in production environment'
    );
  }
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

/**
 * Decrypt data using AES decryption.
 */
const decrypt = (cipher: string): string => {
  if (!IS_PRODUCTION) return cipher; // Skip decryption in development
  if (!SECRET_KEY) {
    throw new Error(
      '[CacheUtils] Missing SECRET_KEY in production environment'
    );
  }
  try {
    return CryptoJS.AES.decrypt(cipher, SECRET_KEY).toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('[CacheUtils] Decryption failed:', error);
    return '';
  }
};

/**
 * Retrieve cached data from localStorage with type safety.
 * @param key - Cache key.
 * @param duration - Cache validity duration in milliseconds.
 * @returns Parsed cached data or `null` if expired or invalid.
 */
export const getCachedData = <T>(key: string, duration: number): T | null => {
  const storageKey = IS_PRODUCTION ? CryptoJS.SHA256(key).toString() : key;
  const cached = localStorage.getItem(storageKey);
  if (!cached) return null;

  try {
    const decrypted = decrypt(cached);
    const { data, timestamp } = JSON.parse(decrypted) as {
      data: T;
      timestamp: number;
    };

    if (Date.now() - timestamp > duration) {
      console.warn(`[CacheUtils] Cache expired for key: ${key}`);
      localStorage.removeItem(storageKey);
      return null;
    }

    return data;
  } catch (error) {
    console.error('[CacheUtils] Failed to retrieve cached data:', error);
    localStorage.removeItem(storageKey);
    return null;
  }
};

/**
 * Store data in localStorage with a timestamp for expiration.
 * @param key - Cache key.
 * @param data - Data to be cached.
 */
export const setCachedData = <T>(key: string, data: T): void => {
  try {
    const storageKey = IS_PRODUCTION ? CryptoJS.SHA256(key).toString() : key;
    const cache = {
      data,
      timestamp: Date.now(),
    };

    const encrypted = encrypt(JSON.stringify(cache));
    localStorage.setItem(storageKey, encrypted);
    console.log(`[CacheUtils] Stored data for key: ${key}`);
  } catch (error) {
    console.error('[CacheUtils] Failed to store data in cache:', error);
  }
};
