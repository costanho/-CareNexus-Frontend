import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// ═══════════════════════════════════════════════════════════════════════════
// DOCTOR PROFILE LANDING PAGE
// ═══════════════════════════════════════════════════════════════════════════
//
// Purpose: Role-specific landing page for doctors after login
//
// Features:
// 1. Doctor profile section with avatar, name, specialty, role badge
// 2. Quick stats (active patients, today's appointments, messages, consultations)
// 3. Available services grid
// 4. Recent patient activity
// 5. Quick action buttons for practice management

@Component({
  selector: 'app-doctor-profile-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './doctor-profile-landing.component.html',
  styleUrls: ['./doctor-profile-landing.component.scss']
})
export class DoctorProfileLandingComponent implements OnInit, OnDestroy {

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 1: COMPONENT STATE
  // ─────────────────────────────────────────────────────────────────────────

  currentUser: any = null;
  currentRole: string | null = null;
  destroy$ = new Subject<void>();

  // Doctor specialty (placeholder)
  specialty = 'Cardiology';

  // Doctor stats
  stats = [
    { label: 'Active Patients', value: '24', icon: '👥', color: '#667eea' },
    { label: "Today's Appointments", value: '6', icon: '📅', color: '#764ba2' },
    { label: 'Patient Messages', value: '5', icon: '💬', color: '#f093fb' },
    { label: 'Total Consultations', value: '248', icon: '✅', color: '#4caf50' }
  ];

  // Available services for doctor
  availableServices = [
    {
      id: 'nexus-direct',
      name: 'Nexus Direct',
      icon: '🏥',
      description: 'Manage your patients, appointments, and consultations',
      features: ['View Appointments', 'Manage Patients', 'Message Patients', 'Schedule Management']
    },
    {
      id: 'nexus-companion',
      name: 'Nexus Companion',
      icon: '🤖',
      description: 'AI tools to support your practice',
      features: ['Patient Insights', 'Clinical Support', 'Analytics', 'Documentation Help']
    }
  ];

  // Quick actions
  quickActions = [
    { label: 'Edit Profile', icon: '✏️', action: 'editProfile' },
    { label: 'Schedule', icon: '📅', action: 'schedule' },
    { label: 'Messages', icon: '💬', action: 'messages' },
    { label: 'Settings', icon: '⚙️', action: 'settings' }
  ];

  // Recent patient activity
  recentPatients = [
    {
      name: 'John Doe',
      lastVisit: 'Today • 10:30 AM',
      status: 'Stable',
      icon: '✅',
      statusType: 'stable'
    },
    {
      name: 'Jane Smith',
      lastVisit: 'Yesterday • 2:00 PM',
      status: 'Follow-up Needed',
      icon: '⚠️',
      statusType: 'followup'
    },
    {
      name: 'Michael Johnson',
      lastVisit: 'Nov 19 • 3:45 PM',
      status: 'Improving',
      icon: '📈',
      statusType: 'improving'
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

    console.log('[DoctorProfileLanding] User:', this.currentUser?.email);
    console.log('[DoctorProfileLanding] Role:', this.currentRole);

    // Redirect to login if no role (user may not always be available)
    // Accept both DOCTOR and ROLE_DOCTOR formats
    if (!this.currentRole || (this.currentRole !== 'ROLE_DOCTOR' && this.currentRole !== 'DOCTOR')) {
      console.warn('[DoctorProfileLanding] Unauthorized access, redirecting to login');
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
  // SECTION 3: SERVICE NAVIGATION
  // ─────────────────────────────────────────────────────────────────────────

  selectService(service: any): void {
    console.log('[DoctorProfileLanding] Selected service:', service.id);
    const route = `/doctor/${service.id}`;
    localStorage.setItem('selectedService', service.id);
    localStorage.setItem('selectedServiceName', service.name);
    this.router.navigate([route]);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 4: QUICK ACTIONS
  // ─────────────────────────────────────────────────────────────────────────

  handleQuickAction(action: string): void {
    console.log('[DoctorProfileLanding] Quick action:', action);

    switch (action) {
      case 'editProfile':
        this.router.navigate(['/doctor/nexus-direct/profile']);
        break;
      case 'schedule':
        this.router.navigate(['/doctor/nexus-direct/appointments']);
        break;
      case 'messages':
        this.router.navigate(['/doctor/nexus-direct/messages']);
        break;
      case 'settings':
        this.router.navigate(['/doctor/nexus-direct/settings']);
        break;
      default:
        console.warn('[DoctorProfileLanding] Unknown action:', action);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 5: UTILITY METHODS
  // ─────────────────────────────────────────────────────────────────────────

  getInitials(): string {
    const name = this.currentUser?.fullName || 'D';
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
