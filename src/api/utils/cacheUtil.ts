import CryptoJS from 'crypto-js';

// Determine if we are in a production environment
const IS_PRODUCTION = import.meta.env.MODE === 'production';

// Require the secret key only in production
const SECRET_KEY = IS_PRODUCTION
  ? import.meta.env.VITE_SECRET_KEY ||
    (() => {
      throw new Error('Missing VITE_SECRET_KEY in production environment!');
    })()
  : null;

/**
 * Encrypt data using AES encryption.
 * @param data - The data to encrypt.
 * @returns Encrypted string (or plaintext in development).
 */
const encrypt = (data: string): string => {
  if (!IS_PRODUCTION) return data; // Skip encryption in development
  return CryptoJS.AES.encrypt(data, SECRET_KEY!).toString();
};

/**
 * Decrypt data using AES decryption.
 * @param cipher - The encrypted string to decrypt.
 * @returns Decrypted string (or plaintext in development).
 */
const decrypt = (cipher: string): string => {
  if (!IS_PRODUCTION) return cipher; // Skip decryption in development
  try {
    return CryptoJS.AES.decrypt(cipher, SECRET_KEY!).toString(
      CryptoJS.enc.Utf8
    );
  } catch (error) {
    console.error('[CacheUtils] Decryption failed:', error);
    return '';
  }
};

/**
 * Hash a key using SHA-256.
 * @param key - The key to hash.
 * @returns The hashed key (or original key in development).
 */
const hashKey = (key: string): string => {
  if (!IS_PRODUCTION) return key; // Skip hashing in development
  return CryptoJS.SHA256(key).toString();
};

/**
 * Retrieve cached data from localStorage with type safety.
 * @param key - The key under which the data is stored.
 * @param duration - The cache validity duration in milliseconds.
 * @returns The cached data or `null` if the cache is invalid, expired, or corrupted.
 */
export const getCachedData = <T>(key: string, duration: number): T | null => {
  const storageKey = hashKey(key); // Hash the key only in production
  const cached = localStorage.getItem(storageKey);
  if (!cached) return null;

  try {
    const decrypted = decrypt(cached);
    const { data, timestamp } = JSON.parse(decrypted) as {
      data: T;
      timestamp: number;
    };

    if (Date.now() - timestamp > duration) {
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
 * @param key - The key under which the data should be stored.
 * @param data - The data to store in the cache.
 */
export const setCachedData = <T>(key: string, data: T): void => {
  try {
    const storageKey = hashKey(key); // Hash the key only in production
    const cache = {
      data,
      timestamp: Date.now(),
    };

    const encrypted = encrypt(JSON.stringify(cache));
    localStorage.setItem(storageKey, encrypted);
  } catch (error) {
    console.error('[CacheUtils] Failed to store data in cache:', error);
  }
};
