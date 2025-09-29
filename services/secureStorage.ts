
import { encrypt, decrypt, createHash } from '../utils/crypto';
import { SESSION_TIMEOUT_MS } from '../constants';

interface StoredData<T> {
  payload: string; // Encrypted data
  hash: string;
  timestamp: number;
}

/**
 * Saves an item to sessionStorage with encryption, a hash for integrity, and a timestamp.
 * @param key The key to store the data under.
 * @param value The value to store (must be JSON-serializable).
 */
export const setItem = <T,>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    const encryptedPayload = encrypt(serializedValue);
    const hash = createHash(encryptedPayload);
    const timestamp = Date.now();

    const dataToStore: StoredData<T> = {
      payload: encryptedPayload,
      hash,
      timestamp,
    };

    sessionStorage.setItem(key, JSON.stringify(dataToStore));
  } catch (error) {
    console.error(`Error saving item '${key}' to secure storage:`, error);
  }
};

/**
 * Retrieves and validates an item from sessionStorage.
 * @param key The key of the item to retrieve.
 * @returns The deserialized value, or null if validation fails or the item doesn't exist.
 */
export const getItem = <T,>(key: string): T | null => {
  try {
    const storedItem = sessionStorage.getItem(key);
    if (!storedItem) {
      return null;
    }

    const data: StoredData<T> = JSON.parse(storedItem);

    // 1. Check for data expiration
    const now = Date.now();
    if (now - data.timestamp > SESSION_TIMEOUT_MS) {
      console.warn(`Data for key '${key}' has expired.`);
      removeItem(key);
      return null;
    }

    // 2. Check for data integrity
    const expectedHash = createHash(data.payload);
    if (data.hash !== expectedHash) {
      console.error(`Data integrity check failed for key '${key}'. Data may have been tampered with.`);
      removeItem(key);
      return null;
    }

    // 3. Decrypt and deserialize
    const decryptedPayload = decrypt(data.payload);
    return JSON.parse(decryptedPayload) as T;
  } catch (error) {
    console.error(`Error retrieving item '${key}' from secure storage:`, error);
    // If there's any error during parsing or decryption, clear the invalid item.
    removeItem(key);
    return null;
  }
};

/**
 * Removes an item from sessionStorage.
 * @param key The key of the item to remove.
 */
export const removeItem = (key: string): void => {
  sessionStorage.removeItem(key);
};
