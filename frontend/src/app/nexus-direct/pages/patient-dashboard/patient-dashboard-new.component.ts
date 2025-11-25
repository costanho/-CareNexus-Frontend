import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-dashboard-new.component.html',
  styleUrls: ['./patient-dashboard-new.component.scss']
})
export class PatientDashboardNewComponent implements OnInit, OnDestroy {

  currentUser: any = null;
  currentRole: string | null = null;
  destroy$ = new Subject<void>();

  // Dashboard tabs
  activeTab: 'appointments' | 'doctors' | 'messages' | 'records' = 'appointments';

  // Patient stats
  stats = [
    { label: 'Upcoming', value: '3', icon: '📅', color: '#667eea' },
    { label: 'Doctors', value: '5', icon: '👨‍⚕️', color: '#764ba2' },
    { label: 'Messages', value: '2', icon: '💬', color: '#f093fb' },
    { label: 'Completed', value: '12', icon: '✅', color: '#4caf50' }
  ];

  // Upcoming appointments
  upcomingAppointments = [
    {
      id: 1,
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: 'Nov 25, 2025',
      time: '2:00 PM',
      status: 'confirmed',
      avatar: '👩‍⚕️'
    },
    {
      id: 2,
      doctorName: 'Dr. Michael Chen',
      specialty: 'Neurology',
      date: 'Nov 28, 2025',
      time: '10:30 AM',
      status: 'pending',
      avatar: '👨‍⚕️'
    },
    {
      id: 3,
      doctorName: 'Dr. Emily Davis',
      specialty: 'Orthopedics',
      date: 'Dec 02, 2025',
      time: '3:45 PM',
      status: 'confirmed',
      avatar: '👩‍⚕️'
    }
  ];

  // Available doctors
  availableDoctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      experience: '12 years',
      rating: 4.8,
      patients: 1200,
      avatar: '👩‍⚕️',
      available: true
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Neurology',
      experience: '8 years',
      rating: 4.6,
      patients: 850,
      avatar: '👨‍⚕️',
      available: true
    },
    {
      id: 3,
      name: 'Dr. Emily Davis',
      specialty: 'Orthopedics',
      experience: '10 years',
      rating: 4.9,
      patients: 950,
      avatar: '👩‍⚕️',
      available: false
    }
  ];

  // Recent messages
  recentMessages = [
    {
      id: 1,
      doctorName: 'Dr. Sarah Johnson',
      message: 'Please remember to take your medications as prescribed',
      timestamp: '2 hours ago',
      unread: true,
      avatar: '👩‍⚕️'
    },
    {
      id: 2,
      doctorName: 'Dr. Michael Chen',
      message: 'Your lab results are ready. Please schedule a follow-up appointment',
      timestamp: '1 day ago',
      unread: false,
      avatar: '👨‍⚕️'
    }
  ];

  // Medical records
  medicalRecords = [
    {
      id: 1,
      title: 'Blood Test Results',
      date: 'Nov 15, 2025',
      type: 'Lab Report',
      doctor: 'Dr. Sarah Johnson',
      icon: '🧪'
    },
    {
      id: 2,
      title: 'Chest X-Ray',
      date: 'Nov 10, 2025',
      type: 'Imaging',
      doctor: 'Dr. Michael Chen',
      icon: '🩻'
    },
    {
      id: 3,
      title: 'Prescription History',
      date: 'Nov 08, 2025',
      type: 'Medication',
      doctor: 'Dr. Emily Davis',
      icon: '💊'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.currentRole = this.authService.getCurrentRole();

    if (!this.currentRole || (this.currentRole !== 'ROLE_PATIENT' && this.currentRole !== 'PATIENT')) {
      this.router.navigate(['/login']);
      return;
    }

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

  // Tab navigation
  switchTab(tab: 'appointments' | 'doctors' | 'messages' | 'records'): void {
    this.activeTab = tab;
  }

  // Actions
  bookAppointment(doctor: any): void {
    console.log('Booking appointment with:', doctor.name);
  }

  cancelAppointment(appointment: any): void {
    console.log('Canceling appointment:', appointment.id);
  }

  rescheduleAppointment(appointment: any): void {
    console.log('Rescheduling appointment:', appointment.id);
  }

  contactDoctor(doctor: any): void {
    this.activeTab = 'messages';
    console.log('Opening messages for doctor:', doctor.name);
  }

  viewRecord(record: any): void {
    console.log('Viewing record:', record.id);
  }

  backToProfile(): void {
    this.router.navigate(['/patient/profile']);
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }
}
