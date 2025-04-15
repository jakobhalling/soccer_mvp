/**
 * Utility functions for interacting with localStorage
 */

/**
 * Save data to localStorage
 * @param key - The key to store the data under
 * @param data - The data to store
 */
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Load data from localStorage
 * @param key - The key to retrieve data from
 * @param defaultValue - Default value to return if key doesn't exist
 * @returns The stored data or defaultValue if not found
 */
export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return defaultValue;
    }
    return JSON.parse(serializedData) as T;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Remove data from localStorage
 * @param key - The key to remove
 */
export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * Clear all data from localStorage
 */
export const clearLocalStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};
