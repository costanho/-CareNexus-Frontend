import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN PROFILE LANDING PAGE
// ═══════════════════════════════════════════════════════════════════════════
//
// Purpose: Role-specific landing page for admins after login
//
// Features:
// 1. Admin profile section with avatar, name, role badge
// 2. System overview stats (total users, doctors, patients, etc.)
// 3. Admin services/tools (user management, analytics, settings)
// 4. System activity and recent events
// 5. Admin quick actions

@Component({
  selector: 'app-admin-profile-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-profile-landing.component.html',
  styleUrls: ['./admin-profile-landing.component.scss']
})
export class AdminProfileLandingComponent implements OnInit, OnDestroy {

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 1: COMPONENT STATE
  // ─────────────────────────────────────────────────────────────────────────

  currentUser: any = null;
  currentRole: string | null = null;
  destroy$ = new Subject<void>();

  // System stats
  stats = [
    { label: 'Total Users', value: '1,234', icon: '👥', color: '#667eea' },
    { label: 'Active Doctors', value: '156', icon: '⚕️', color: '#764ba2' },
    { label: 'Active Patients', value: '892', icon: '🏥', color: '#f093fb' },
    { label: 'Total Appointments', value: '5,432', icon: '📅', color: '#4caf50' }
  ];

  // Available admin services/tools
  adminServices = [
    {
      id: 'user-management',
      name: 'User Management',
      icon: '👥',
      description: 'Manage user accounts, roles, and permissions',
      features: ['View Users', 'Manage Doctors', 'Manage Patients', 'Role Management']
    },
    {
      id: 'system-analytics',
      name: 'System Analytics',
      icon: '📊',
      description: 'View system-wide analytics and insights',
      features: ['Usage Reports', 'User Trends', 'Service Metrics', 'Financial Reports']
    },
    {
      id: 'system-settings',
      name: 'System Settings',
      icon: '⚙️',
      description: 'Configure system-wide settings and policies',
      features: ['General Settings', 'Security Policy', 'Email Templates', 'System Config']
    }
  ];

  // Quick actions for admin
  quickActions = [
    { label: 'Manage Users', icon: '👥', action: 'manageUsers' },
    { label: 'View Analytics', icon: '📊', action: 'analytics' },
    { label: 'System Health', icon: '🏥', action: 'health' },
    { label: 'Settings', icon: '⚙️', action: 'settings' }
  ];

  // System activity/events
  systemActivity = [
    {
      title: 'New User Registration',
      description: 'Dr. Sarah Johnson registered as Doctor',
      timestamp: 'Nov 21, 2025 • 3:45 PM',
      icon: '✅',
      type: 'success'
    },
    {
      title: 'System Update',
      description: 'Security patches applied successfully',
      timestamp: 'Nov 21, 2025 • 2:30 PM',
      icon: '🔄',
      type: 'info'
    },
    {
      title: 'User Account Suspended',
      description: 'Account suspended due to policy violation',
      timestamp: 'Nov 20, 2025 • 10:15 AM',
      icon: '⚠️',
      type: 'warning'
    }
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 2: CONSTRUCTOR & LIFECYCLE
  // ─────────────────────────────────────────────────────────────────────────

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get current user and role
    this.currentUser = this.authService.getCurrentUser();
    this.currentRole = this.authService.getCurrentRole();

    console.log('[AdminProfileLanding] User:', this.currentUser?.email);
    console.log('[AdminProfileLanding] Role:', this.currentRole);

    // Redirect to login if no role (user may not always be available)
    // Accept both ADMIN and ROLE_ADMIN formats
    if (!this.currentRole || (this.currentRole !== 'ROLE_ADMIN' && this.currentRole !== 'ADMIN')) {
      console.warn('[AdminProfileLanding] Unauthorized access, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    // Listen for logout
    this.authService.currentUserRole$
      .pipe(takeUntil(this.destroy$))
      .subscribe(role => {
        if (!role) {
          this.router.navigate(['/login']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 3: ADMIN SERVICE NAVIGATION
  // ─────────────────────────────────────────────────────────────────────────

  selectService(service: any): void {
    console.log('[AdminProfileLanding] Selected service:', service.id);
    const route = `/admin/${service.id}`;
    localStorage.setItem('selectedAdminService', service.id);
    localStorage.setItem('selectedAdminServiceName', service.name);
    this.router.navigate([route]);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 4: QUICK ACTIONS
  // ─────────────────────────────────────────────────────────────────────────

  handleQuickAction(action: string): void {
    console.log('[AdminProfileLanding] Quick action:', action);

    switch (action) {
      case 'manageUsers':
        this.router.navigate(['/admin/user-management']);
        break;
      case 'analytics':
        this.router.navigate(['/admin/system-analytics']);
        break;
      case 'health':
        this.router.navigate(['/admin/system-health']);
        break;
      case 'settings':
        this.router.navigate(['/admin/system-settings']);
        break;
      default:
        console.warn('[AdminProfileLanding] Unknown action:', action);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 5: UTILITY METHODS
  // ─────────────────────────────────────────────────────────────────────────

  getInitials(): string {
    const name = this.currentUser?.fullName || 'A';
    return name
      .split(' ')
      .map((part: string) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getAvatarColor(): string {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4caf50'];
    const charCode = this.currentUser?.email?.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  }
}
