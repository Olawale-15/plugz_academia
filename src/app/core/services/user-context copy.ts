import { Injectable } from '@angular/core';

export interface MerchantInfo {
  merchantId: string;
  merchantName: string;
  logoUrl?: string;
}

export interface ServiceInfo {
  serviceId: string;
  serviceName: string;
}

export interface SafeAuthData {
  userId: string;
  fullname: string;
  email?: string;
  imageUrl?: string;
  roleId?: string;
  merchantInfo?: MerchantInfo;
  serviceInfo?: ServiceInfo[];
  token?: string;
}

@Injectable({ providedIn: 'root' })
export class UserContextService {
  private user: SafeAuthData | null = null;
  private readonly STORAGE_KEY = 'user';

  constructor() {
    const savedUser = sessionStorage.getItem(this.STORAGE_KEY);
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
  }

  setUser(data: SafeAuthData) {
    this.user = data;
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }
  get merchantLogo(): string | null {
    return this.user?.merchantInfo?.logoUrl || null;
  }

  updateFullName(firstname: string, lastname: string) {
    if (this.user) {
      this.user.fullname = `${firstname} ${lastname}`.trim();
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.user));
    }
  }

  updateMerchantName(newName: string) {
    if (this.user?.merchantInfo) {
      this.user.merchantInfo.merchantName = newName;
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.user));
    }
  }

  clearUser() {
    this.user = null;
    sessionStorage.removeItem(this.STORAGE_KEY);
  }

  get userData(): SafeAuthData | null {
    return this.user;
  }

  get fullName(): string | null {
    return this.user?.fullname || null;
  }
  get userId(): string | null {
    return this.user?.userId || null;
  }

  get merchantId(): string | null {
    return this.user?.merchantInfo?.merchantId || null;
  }

  get merchantName(): string | null {
    return this.user?.merchantInfo?.merchantName || null;
  }

  get roleId(): string | null {
    return this.user?.roleId || null;
  }

  get hasServices(): boolean {
    return !!this.user?.serviceInfo?.length;
  }

  get token(): string | null {
    return this.user?.token || null;
  }
}
