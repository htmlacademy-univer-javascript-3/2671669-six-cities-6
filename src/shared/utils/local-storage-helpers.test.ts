import {LocalStorageHelpers} from './local-storage-helpers.ts';

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const TEST_KEY = 'six-cities-token';

describe('LocalStorageHelpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('saveAuthToken', () => {
    it('should call localStorage.setItem with the correct key and token', () => {
      const token = 'my-test-token';
      LocalStorageHelpers.saveAuthToken(token);

      expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(TEST_KEY, token);
    });
  });

  describe('getAuthToken', () => {
    it('should return the token when localStorage returns it', () => {
      const token = 'stored-token';
      localStorageMock.getItem.mockReturnValue(token);

      const result = LocalStorageHelpers.getAuthToken();

      expect(result).toBe(token);
      expect(localStorageMock.getItem).toHaveBeenCalledWith(TEST_KEY);
    });

    it('should return null when localStorage is empty', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = LocalStorageHelpers.getAuthToken();
      expect(result).toBeNull();
    });
  });

  describe('removeAuthToken', () => {
    it('should call localStorage.removeItem with the correct key', () => {
      LocalStorageHelpers.removeAuthToken();

      expect(localStorageMock.removeItem).toHaveBeenCalledTimes(1);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(TEST_KEY);
    });
  });
});
