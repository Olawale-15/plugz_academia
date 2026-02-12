// // src/app/core/interceptors/auth.interceptor.ts
// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { TokenService } from '../services/token.service';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const tokenService = inject(TokenService);
//   const accessToken = tokenService.accessToken;

//   const authReq = accessToken
//     ? req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     })
//     : req;

//   return next(authReq);
// };


import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service'; // Ensure this path is correct

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const accessToken = tokenService.accessToken;

  // DEBUG LOGS (Check your browser console after saving this)
  if (accessToken) {
    console.log(' Interceptor: Token found. Attaching to request:', req.url);
  } else {
    console.warn(' Interceptor: No token found in TokenService!');
  }

  const authReq = accessToken
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    : req;

  return next(authReq);
};