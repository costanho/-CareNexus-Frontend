import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-dashboard-new.component.html',
  styleUrls: ['./doctor-dashboard-new.component.scss']
})
export class DoctorDashboardNewComponent implements OnInit, OnDestroy {

  currentUser: any = null;
  currentRole: string | null = null;
  destroy$ = new Subject<void>();

  activeTab: 'appointments' | 'patients' | 'consultations' | 'messages' = 'appointments';

  // Doctor stats
  stats = [
    {
      icon: '📅',
      value: 8,
      label: 'Today\'s Appointments',
      color: '#667eea'
    },
    {
      icon: '👥',
      value: 156,
      label: 'Total Patients',
      color: '#764ba2'
    },
    {
      icon: '⭐',
      value: 4.8,
      label: 'Rating',
      color: '#ffc107'
    },
    {
      icon: '💬',
      value: 12,
      label: 'Pending Messages',
      color: '#f093fb'
    }
  ];

  // Upcoming appointments for doctor
  upcomingAppointments = [
    {
      id: 1,
      patientName: 'Sarah Anderson',
      patientAvatar: '👩',
      condition: 'Annual Check-up',
      date: 'Nov 25, 2025',
      time: '9:00 AM',
      status: 'confirmed',
      duration: '30 mins',
      type: 'In-person'
    },
    {
      id: 2,
      patientName: 'James Wilson',
      patientAvatar: '👨',
      condition: 'Follow-up Consultation',
      date: 'Nov 25, 2025',
      time: '10:00 AM',
      status: 'confirmed',
      duration: '20 mins',
      type: 'Video Call'
    },
    {
      id: 3,
      patientName: 'Emma Johnson',
      patientAvatar: '👧',
      condition: 'Allergy Test Results',
      date: 'Nov 25, 2025',
      time: '11:00 AM',
      status: 'pending',
      duration: '25 mins',
      type: 'In-person'
    },
    {
      id: 4,
      patientName: 'Michael Chen',
      patientAvatar: '👨',
      condition: 'Blood Pressure Check',
      date: 'Nov 25, 2025',
      time: '2:00 PM',
      status: 'confirmed',
      duration: '15 mins',
      type: 'Telemedicine'
    }
  ];

  // Patient list
  patients = [
    {
      id: 1,
      name: 'Sarah Anderson',
      avatar: '👩',
      age: 32,
      lastVisit: 'Nov 20, 2025',
      condition: 'Hypertension',
      status: 'Active',
      riskLevel: 'Low'
    },
    {
      id: 2,
      name: 'James Wilson',
      avatar: '👨',
      age: 45,
      lastVisit: 'Nov 18, 2025',
      condition: 'Diabetes',
      status: 'Active',
      riskLevel: 'Medium'
    },
    {
      id: 3,
      name: 'Emma Johnson',
      avatar: '👧',
      age: 12,
      lastVisit: 'Nov 15, 2025',
      condition: 'Seasonal Allergies',
      status: 'Active',
      riskLevel: 'Low'
    },
    {
      id: 4,
      name: 'Michael Chen',
      avatar: '👨',
      age: 58,
      lastVisit: 'Nov 10, 2025',
      condition: 'Heart Disease',
      status: 'Active',
      riskLevel: 'High'
    },
    {
      id: 5,
      name: 'Lisa Brown',
      avatar: '👩',
      age: 28,
      lastVisit: 'Oct 30, 2025',
      condition: 'Thyroid Issues',
      status: 'Inactive',
      riskLevel: 'Medium'
    }
  ];

  // Ongoing consultations
  consultations = [
    {
      id: 1,
      patientName: 'Robert Taylor',
      patientAvatar: '👨',
      startTime: '10:00 AM',
      duration: '15 mins',
      type: 'Video Call',
      status: 'in-progress',
      notes: 'Discussing medication adjustment'
    },
    {
      id: 2,
      patientName: 'Jessica Lee',
      patientAvatar: '👩',
      startTime: '10:30 AM',
      duration: '25 mins',
      type: 'In-person',
      status: 'waiting',
      notes: 'Patient arrived, awaiting doctor'
    },
    {
      id: 3,
      patientName: 'David Miller',
      patientAvatar: '👨',
      startTime: '11:00 AM',
      duration: '20 mins',
      type: 'In-person',
      status: 'scheduled',
      notes: 'Initial consultation'
    }
  ];

  // Messages from patients
  patientMessages = [
    {
      id: 1,
      patientName: 'Sarah Anderson',
      patientAvatar: '👩',
      message: 'Doctor, I\'m experiencing some side effects from the medication. Can we discuss?',
      timestamp: '2 hours ago',
      unread: true,
      priority: 'high'
    },
    {
      id: 2,
      patientName: 'James Wilson',
      patientAvatar: '👨',
      message: 'Thank you for the prescription. It\'s working well!',
      timestamp: '4 hours ago',
      unread: false,
      priority: 'normal'
    },
    {
      id: 3,
      patientName: 'Emma Johnson',
      patientAvatar: '👧',
      message: 'When can I schedule my next appointment?',
      timestamp: '1 day ago',
      unread: true,
      priority: 'normal'
    },
    {
      id: 4,
      patientName: 'Michael Chen',
      patientAvatar: '👨',
      message: 'My blood pressure reading today was 140/85',
      timestamp: '1 day ago',
      unread: false,
      priority: 'high'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.currentRole = this.authService.getCurrentRole();

    if (!this.currentRole || (this.currentRole !== 'ROLE_DOCTOR' && this.currentRole !== 'DOCTOR')) {
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

  switchTab(tab: 'appointments' | 'patients' | 'consultations' | 'messages'): void {
    this.activeTab = tab;
  }

  getUnreadMessageCount(): number {
    return this.patientMessages.filter(m => m.unread).length;
  }

  startConsultation(appointment: any): void {
    console.log('Starting consultation with:', appointment.patientName);
  }

  rescheduleAppointment(appointment: any): void {
    console.log('Rescheduling appointment with:', appointment.patientName);
  }

  completeAppointment(appointment: any): void {
    console.log('Completing appointment with:', appointment.patientName);
  }

  viewPatientProfile(patient: any): void {
    console.log('Viewing patient profile:', patient.name);
  }

  addPrescription(patient: any): void {
    console.log('Adding prescription for:', patient.name);
  }

  reviewPatient(patient: any): void {
    console.log('Reviewing patient records:', patient.name);
  }

  endConsultation(consultation: any): void {
    console.log('Ending consultation with:', consultation.patientName);
  }

  viewPatientFile(consultation: any): void {
    console.log('Viewing patient file for:', consultation.patientName);
  }

  replyMessage(message: any): void {
    console.log('Replying to message from:', message.patientName);
  }

  markAsRead(message: any): void {
    console.log('Marking message as read from:', message.patientName);
    message.unread = false;
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }

  backToProfile(): void {
    this.router.navigate(['/doctor/profile']);
  }
}
