import { cloudStorage } from '@tma.js/sdk';
import type { StateStorage } from 'zustand/middleware';

/**
 * A persistence storage wrapper that prefers Telegram cloud storage when available,
 * and falls back to localStorage otherwise. Designed for use with zustand/persist.
 */
const isCloudSupported = () => {
  try {
    // cloudStorage.isSupported is a computed signal — call it to get the boolean
    // In some environments the SDK may not be fully initialized but the property exists
    // so guard against exceptions
    return Boolean(typeof cloudStorage?.isSupported === 'function' ? cloudStorage.isSupported() : cloudStorage?.isSupported);
  } catch (_) {
    return false;
  }
};

const cloudWrapper: StateStorage = {
  async getItem(key: string) {
    try {
      if (isCloudSupported()) {
        // getItem returns a string via BetterPromise
        const v = await cloudStorage.getItem(key) as string | undefined;
        if (v !== undefined && v !== null && v !== '') {
          return v;
        }
      }
    } catch (e) {
      // ignore and fallback
      // eslint-disable-next-line no-console
      console.warn('Cloud getItem failed, falling back to localStorage', e);
    }

    try {
      const v = localStorage.getItem(key);
      return v;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('localStorage getItem failed', e);
      return null;
    }
  },

  async setItem(key: string, value: string) {
    try {
      // Write into localStorage first to keep a local fallback
      localStorage.setItem(key, value);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('localStorage setItem failed', e);
    }

    try {
      if (isCloudSupported()) {
        await cloudStorage.setItem(key, value);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Cloud setItem failed', e);
    }
  },

  async removeItem(key: string) {
    try {
      if (isCloudSupported()) {
        await cloudStorage.deleteItem(key);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Cloud deleteItem failed', e);
    }
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('localStorage removeItem failed', e);
    }
  },
};

export default cloudWrapper;
