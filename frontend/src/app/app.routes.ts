import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

/**
 * App Routes Configuration
 *
 * Public routes: landing (home), login, register (no guard needed)
 * Protected routes:
 *   - /service-selection (choose which module to use)
 *   - /patient/{service} (patient role specific)
 *   - /doctor/{service} (doctor role specific)
 *   - /dashboard, /doctors, /appointments, etc. (legacy routes for Nexus Direct)
 * Default: empty path → landing page
 */
export const routes: Routes = [
  // ═══════════════════════════════════════════════════════════
  // PUBLIC ROUTES (No authentication required)
  // ═══════════════════════════════════════════════════════════

  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent),
    data: { title: 'Home' }
  },

  {
    path: 'login',
    loadComponent: () => import('./auth/pages/login/login.component').then(m => m.LoginComponent),
    data: { title: 'Login' }
  },

  {
    path: 'register',
    loadComponent: () => import('./auth/pages/register/register.component').then(m => m.RegisterComponent),
    data: { title: 'Register' }
  },

  // ═══════════════════════════════════════════════════════════
  // PROFILE LANDING PAGES (Role-specific landing after login)
  // ═══════════════════════════════════════════════════════════

  {
    path: 'patient/profile',
    loadComponent: () => import('./pages/profile-landing/patient-profile-landing.component').then(m => m.PatientProfileLandingComponent),
    canActivate: [AuthGuard],
    data: { title: 'Patient Profile' }
  },

  {
    path: 'doctor/profile',
    loadComponent: () => import('./pages/profile-landing/doctor-profile-landing.component').then(m => m.DoctorProfileLandingComponent),
    canActivate: [AuthGuard],
    data: { title: 'Doctor Profile' }
  },

  {
    path: 'admin/profile',
    loadComponent: () => import('./pages/profile-landing/admin-profile-landing.component').then(m => m.AdminProfileLandingComponent),
    canActivate: [AuthGuard],
    data: { title: 'Admin Profile' }
  },

  // ═══════════════════════════════════════════════════════════
  // SERVICE SELECTION (After login, user chooses service)
  // ═══════════════════════════════════════════════════════════

  {
    path: 'service-selection',
    loadComponent: () => import('./pages/service-selection/service-selection.component').then(m => m.ServiceSelectionComponent),
    canActivate: [AuthGuard],
    data: { title: 'Choose Service' }
  },

  // ═══════════════════════════════════════════════════════════
  // ROLE-BASED ROUTES (Patient vs Doctor specific)
  // ═══════════════════════════════════════════════════════════

  {
    path: 'patient/nexus-direct',
    loadComponent: () => import('./nexus-direct/pages/patient-dashboard/patient-dashboard.component').then(m => m.PatientDashboardComponent),
    canActivate: [AuthGuard],
    data: { title: 'Nexus Direct - Patient' }
  },

  {
    path: 'doctor/nexus-direct',
    loadComponent: () => import('./nexus-direct/pages/doctor-dashboard/doctor-dashboard-new.component').then(m => m.DoctorDashboardNewComponent),
    canActivate: [AuthGuard],
    data: { title: 'Nexus Direct - Doctor' }
  },

  {
    path: 'patient/nexus-proxy',
    loadComponent: () => import('./nexus-direct/pages/patient-proxy/patient-proxy.component').then(m => m.PatientProxyComponent),
    canActivate: [AuthGuard],
    data: { title: 'Nexus Proxy - Patient' }
  },

  {
    path: 'patient/nexus-companion',
    loadComponent: () => import('./nexus-direct/pages/patient-companion/patient-companion-new.component').then(m => m.PatientCompanionNewComponent),
    canActivate: [AuthGuard],
    data: { title: 'Nexus Companion - Patient' }
  },

  {
    path: 'doctor/nexus-companion',
    loadComponent: () => import('./nexus-direct/pages/doctor-companion/doctor-companion-new.component').then(m => m.DoctorCompanionNewComponent),
    canActivate: [AuthGuard],
    data: { title: 'Nexus Companion - Doctor' }
  },

  // ═══════════════════════════════════════════════════════════
  // PROTECTED ROUTES (Require authentication)
  // Legacy routes for Nexus Direct (can navigate directly)
  // ═══════════════════════════════════════════════════════════

  {
    path: 'dashboard',
    loadComponent: () => import('./nexus-direct/pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard],
    data: { title: 'Dashboard' }
  },

  {
    path: 'doctors',
    loadComponent: () => import('./nexus-direct/pages/doctor-list/doctor-list.component').then(m => m.DoctorListComponent),
    canActivate: [AuthGuard],
    data: { title: 'Find Doctors' }
  },

  {
    path: 'doctor/:id',
    loadComponent: () => import('./nexus-direct/pages/doctor-detail/doctor-detail.component').then(m => m.DoctorDetailComponent),
    canActivate: [AuthGuard],
    data: { title: 'Doctor Profile' }
  },

  {
    path: 'appointments',
    loadComponent: () => import('./nexus-direct/pages/appointments/appointments.component').then(m => m.AppointmentsComponent),
    canActivate: [AuthGuard],
    data: { title: 'My Appointments' }
  },

  {
    path: 'schedule-appointment/:doctorId',
    loadComponent: () => import('./nexus-direct/pages/schedule-appointment/schedule-appointment.component').then(m => m.ScheduleAppointmentComponent),
    canActivate: [AuthGuard],
    data: { title: 'Book Appointment' }
  },

  {
    path: 'messages',
    loadComponent: () => import('./nexus-direct/pages/messages/messages.component').then(m => m.MessagesComponent),
    canActivate: [AuthGuard],
    data: { title: 'Messages' }
  },

  {
    path: 'profile',
    loadComponent: () => import('./nexus-direct/pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard],
    data: { title: 'My Profile' }
  },

  {
    path: 'settings',
    loadComponent: () => import('./nexus-direct/pages/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [AuthGuard],
    data: { title: 'Settings' }
  },

  // ═══════════════════════════════════════════════════════════
  // FALLBACK REDIRECT
  // ═══════════════════════════════════════════════════════════

  {
    path: '**',
    redirectTo: ''
  }
];
