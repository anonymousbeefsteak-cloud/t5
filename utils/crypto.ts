/**
 * "Encrypts" a string using Base64 encoding.
 * This version is robust and correctly handles Unicode characters.
 * @param text The string to encode.
 * @returns A Base64 encoded string.
 */
export const encrypt = (text: string): string => {
  try {
    // Use encodeURIComponent to handle Unicode characters correctly, then convert to a byte stream for btoa.
    return btoa(
      encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      })
    );
  } catch (e) {
    console.error("Encryption failed", e);
    return '';
  }
};

/**
 * "Decrypts" a Base64 encoded string.
 * This version is robust and correctly handles Unicode characters.
 * @param data The Base64 encoded string.
 * @returns The original string.
 */
export const decrypt = (data: string): string => {
  try {
    // First, decode from base64. Then, convert the byte stream back to a percent-encoded string for decodeURIComponent.
    return decodeURIComponent(
      atob(data)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  } catch (e) {
    console.error("Decryption failed", e);
    return '';
  }
};

/**
 * Creates a simple hash (checksum) of a string for data integrity checks.
 * This is a basic algorithm and not a cryptographic hash function.
 * @param text The input string.
 * @returns A numeric hash.
 */
export const createHash = (text: string): string => {
  let hash = 0;
  if (text.length === 0) {
    return hash.toString();
  }
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
};