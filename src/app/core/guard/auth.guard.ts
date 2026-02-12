// src/app/core/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { jwtDecode } from 'jwt-decode';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private tokenService: TokenService
  ) { }

  canActivate(): boolean {
    const token = this.tokenService.accessToken;

    if (!token) {
      this.tokenService.clear();
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp && decoded.exp < now) {
        this.tokenService.clear();
        this.router.navigate(['/login']);
        return false;
      }

      return true;
    } catch (err) {
      this.tokenService.clear();
      this.router.navigate(['/login']);
      return false;
    }
  }
}
