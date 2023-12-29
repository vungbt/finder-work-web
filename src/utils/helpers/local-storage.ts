/* eslint-disable no-empty */
export enum EKeyStorage {
  LOCALE = 'locale',
  THEME_MODE = 'theme_mode',
  UI = 'ui',
  SESSION = 'session',
  VIEW_ROLE = 'view_role'
}

const localStorageHelper = {
  set: (key: EKeyStorage, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {}
    return false;
  },
  setObject: (key: EKeyStorage, value: unknown): boolean => {
    try {
      const newValue = JSON.stringify(value);
      localStorage.setItem(key, newValue);
      return true;
    } catch (error) {}
    return false;
  },
  get: (key: EKeyStorage, defaultValue: string | null = null): string | null => {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        return value;
      }
    } catch (error) {}
    return defaultValue;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getObject: (key: EKeyStorage, defaultValue: unknown = {}): any => {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        const object = JSON.parse(value);
        return object || defaultValue;
      }
    } catch (error) {}
    return defaultValue;
  },
  remove: (key: EKeyStorage) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
  }
};

export default localStorageHelper;
