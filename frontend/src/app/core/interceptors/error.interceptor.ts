import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

/**
 * Global Error Interceptor (Functional approach for Angular 14.3+)
 *
 * Catches all HTTP errors and handles them:
 * - 401 (Token expired) → Redirect to login
 * - 403 (Forbidden) → Show error
 * - 500 (Server error) → Show error
 * - Others → Show error
 */
export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  // Get services from dependency injection
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle different error types
      if (error.status === 401) {
        // Token expired or invalid
        console.error('Unauthorized - Token expired');
        authService.logout();
        router.navigate(['/login']);
      } else if (error.status === 403) {
        // Access forbidden
        console.error('Forbidden:', error.error?.error || 'Access denied');
      } else if (error.status === 500) {
        // Server error
        console.error('Server error:', error.error?.error || 'Internal server error');
      } else {
        // Other errors
        console.error('Error:', error.error?.error || error.message);
      }

      // Pass error to component
      return throwError(() => error);
    })
  );
};
