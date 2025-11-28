import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
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

  // Navigation state
  isCareNexusExpanded: boolean = false;

  // Mobile & Ionic Platform Detection
  isMobileDevice: boolean = false;
  isIonicApp: boolean = false;
  screenWidth: number = 0;
  isSmallPhone: boolean = false; // iPhone SE, 375px and below

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

    // Detect mobile platform
    this.detectMobileDevice();
    this.detectIonicApp();

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

    console.log('[DoctorProfileLanding] Mobile Device:', this.isMobileDevice);
    console.log('[DoctorProfileLanding] Ionic App:', this.isIonicApp);
    console.log('[DoctorProfileLanding] Screen Width:', this.screenWidth);
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
  // SECTION 4.5: NAVIGATION TOGGLES
  // ─────────────────────────────────────────────────────────────────────────

  toggleCareNexus(): void {
    this.isCareNexusExpanded = !this.isCareNexusExpanded;
    console.log('[DoctorProfileLanding] CareNexus menu expanded:', this.isCareNexusExpanded);
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

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION 6: MOBILE & IONIC SUPPORT
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Detect if running on a mobile device
   * Checks for common mobile user agents and platform info
   */
  private detectMobileDevice(): void {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobilePatterns = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const maxTouchPoints = navigator.maxTouchPoints || 0;

    this.isMobileDevice = mobilePatterns.test(userAgent) || maxTouchPoints > 0;
    this.screenWidth = window.innerWidth;
    this.isSmallPhone = this.screenWidth <= 375;

    console.log('[DoctorProfileLanding] Mobile Detection:', {
      userAgent: userAgent.substring(0, 50),
      isMobile: this.isMobileDevice,
      maxTouchPoints: maxTouchPoints,
      screenWidth: this.screenWidth
    });
  }

  /**
   * Detect if running as an Ionic application
   * Checks for Ionic's capacitor or cordova APIs
   */
  private detectIonicApp(): void {
    // Check for Ionic Capacitor (modern Ionic)
    this.isIonicApp = !!(window as any).CapacitorConsoleHandler || !!(window as any).Capacitor;

    // Check for Cordova (legacy)
    if (!this.isIonicApp && (window as any).cordova) {
      this.isIonicApp = true;
    }

    console.log('[DoctorProfileLanding] Ionic Detection:', {
      isIonicApp: this.isIonicApp,
      hasCapacitor: !!(window as any).Capacitor,
      hasCordova: !!(window as any).cordova
    });
  }

  /**
   * Listen for window resize events to update responsive state
   * This helps handle orientation changes and window resizing on mobile
   */
  @HostListener('window:resize')
  onWindowResize(): void {
    const newWidth = window.innerWidth;
    if (newWidth !== this.screenWidth) {
      this.screenWidth = newWidth;
      this.isSmallPhone = this.screenWidth <= 375;

      console.log('[DoctorProfileLanding] Window resized:', {
        newWidth: this.screenWidth,
        isSmallPhone: this.isSmallPhone,
        isPortrait: window.innerHeight > window.innerWidth,
        isLandscape: window.innerHeight < window.innerWidth
      });
    }
  }

  /**
   * Handle back button on mobile devices
   * If using Ionic with Capacitor, this integrates with hardware back button
   *
   * Future Integration with Ionic:
   * If migrating to Ionic components, integrate with:
   * - Hardware back button: this.backButtonService.registerHandler()
   * - Navigation: ion-nav, ion-router
   * - Menu: ion-menu for sidebar
   */
  handleBackButton(): void {
    console.log('[DoctorProfileLanding] Back button pressed');
    this.router.navigate(['/login']);
  }

  /**
   * Prevent zoom on double-tap (mobile browsers)
   * Improves mobile UX by disabling pinch-zoom
   */
  @HostListener('window:touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }

  /**
   * Get computed safe area for devices with notches/cutouts
   * Useful for iOS devices with notch
   */
  getSafeAreaInsets(): { top: number; bottom: number; left: number; right: number } {
    const safeAreaInsets = getComputedStyle(document.documentElement);
    return {
      top: parseInt(safeAreaInsets.getPropertyValue('--safe-area-inset-top')) || 0,
      bottom: parseInt(safeAreaInsets.getPropertyValue('--safe-area-inset-bottom')) || 0,
      left: parseInt(safeAreaInsets.getPropertyValue('--safe-area-inset-left')) || 0,
      right: parseInt(safeAreaInsets.getPropertyValue('--safe-area-inset-right')) || 0
    };
  }
}
