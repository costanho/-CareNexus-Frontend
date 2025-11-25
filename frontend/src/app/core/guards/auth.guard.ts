import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Auth Guard - Protects routes from unauthorized access
 *
 * How it works:
 * 1. User tries to visit /dashboard
 * 2. Guard checks: Is user logged in?
 * 3. If YES → Allow access ✓
 * 4. If NO → Redirect to /login ✗
 *
 * Used on: Protected routes (dashboard, appointments, doctors, etc.)
 * Not used on: Public routes (login, register)
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    // Check if user is authenticated
    if (this.authService.isAuthenticated()) {
      // User logged in → Allow access
      return true;
    } else {
      // User not logged in → Redirect to login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
