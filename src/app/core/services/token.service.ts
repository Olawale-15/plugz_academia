// src/app/core/services/token.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private ACCESS_KEY = 'accessToken';
  private REFRESH_KEY = 'refreshToken';
  private EXPIRY_KEY = 'tokenExpiry';

  set accessToken(token: string) {
    sessionStorage.setItem(this.ACCESS_KEY, token);
  }

  get accessToken(): string {
    return sessionStorage.getItem(this.ACCESS_KEY) || '';
  }

  set refreshToken(token: string) {
    sessionStorage.setItem(this.REFRESH_KEY, token);
  }

  get refreshToken(): string {
    return sessionStorage.getItem(this.REFRESH_KEY) || '';
  }

  set tokenExpiry(expiry: string) {
    sessionStorage.setItem(this.EXPIRY_KEY, expiry);
  }

  get tokenExpiry(): string {
    return sessionStorage.getItem(this.EXPIRY_KEY) || '';
  }

  isAccessTokenExpired(): boolean {
    const expiry = this.tokenExpiry;
    return !expiry || new Date(expiry) <= new Date();
  }

  clear(): void {
    sessionStorage.removeItem(this.ACCESS_KEY);
    sessionStorage.removeItem(this.REFRESH_KEY);
    sessionStorage.removeItem(this.EXPIRY_KEY);
  }
}
