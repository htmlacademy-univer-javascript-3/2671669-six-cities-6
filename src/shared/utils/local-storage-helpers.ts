const AUTH_TOKEN_KEY = 'six-cities-token';

export class LocalStorageHelpers {
  static saveAuthToken(token: string): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  static getAuthToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  static removeAuthToken(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}
