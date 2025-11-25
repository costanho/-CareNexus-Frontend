import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { tap, catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';

/**
 * JWT Interceptor (Functional approach for Angular 14.3+)
 *
 * Automatically attaches JWT token to all HTTP requests that require authentication
 *
 * - Retrieves token from localStorage via StorageService
 * - Adds Authorization: Bearer {token} header to protected endpoints
 * - Skips auth for public endpoints (login, register, refresh)
 * - Logs all interceptor activity for debugging
 */
export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  // Get the StorageService from dependency injection
  const storageService = inject(StorageService);

  // Get the JWT token from storage
  const token = storageService.getAccessToken();

  // Debug logging
  console.log('[JwtInterceptor] ═══════════════════════════════════════════');
  console.log('[JwtInterceptor] Request URL:', request.url);
  console.log('[JwtInterceptor] Request Method:', request.method);
  console.log('[JwtInterceptor] Token exists:', !!token);
  if (token) {
    console.log('[JwtInterceptor] Token value:', `${token.substring(0, 30)}...${token.substring(token.length - 10)}`);
  }

  // Endpoints that do NOT need JWT (user not authenticated yet)
  const noAuthRequired = ['/auth/login', '/auth/register', '/auth/refresh'];
  const isNoAuthEndpoint = noAuthRequired.some(endpoint => request.url.includes(endpoint));

  // Add token to request if it exists AND endpoint requires auth
  if (token && !isNoAuthEndpoint) {
    console.log('[JwtInterceptor] ✓ Adding Authorization header...');
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('[JwtInterceptor] ✓ Authorization header added!');
    console.log('[JwtInterceptor] Headers:', request.headers.keys());
    console.log('[JwtInterceptor] Authorization header value:', request.headers.get('Authorization'));
  } else if (!token && !isNoAuthEndpoint) {
    console.error('[JwtInterceptor] ✗ NO TOKEN but endpoint requires auth:', request.url);
  } else if (isNoAuthEndpoint) {
    console.log('[JwtInterceptor] - No auth needed for:', request.url);
  }

  console.log('[JwtInterceptor] ═══════════════════════════════════════════');

  // Execute request and handle response
  return next(request).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        console.log('[JwtInterceptor] ✓ Response received:', event.status, event.url);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      console.error('[JwtInterceptor] ✗ HTTP Error:', error.status, error.statusText);
      console.error('[JwtInterceptor] Error message:', error.message);
      console.error('[JwtInterceptor] Error body:', error.error);
      return throwError(() => error);
    })
  );
};
