import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ServiceHeaderComponent } from '../../../shared/components/service-header/service-header.component';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ServiceHeaderComponent],
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.scss']
})
export class DoctorDashboardComponent implements OnInit {

  currentUser: any = null;

  // Doctor stats
  totalPatients = 24;
  todayAppointments = 3;
  pendingMessages = 5;
  totalAppointments = 156;

  // Today's appointments
  todaysAppointments = [
    {
      id: 1,
      patientName: 'John Smith',
      time: '10:00 AM',
      reason: 'Heart checkup',
      duration: '30 mins',
      status: 'Confirmed'
    },
    {
      id: 2,
      patientName: 'Emma Johnson',
      time: '11:00 AM',
      reason: 'Follow-up consultation',
      duration: '30 mins',
      status: 'Confirmed'
    },
    {
      id: 3,
      patientName: 'Michael Brown',
      time: '2:00 PM',
      reason: 'New patient initial consultation',
      duration: '45 mins',
      status: 'Pending'
    }
  ];

  // Recent patient consultations
  recentPatients = [
    { id: 1, name: 'John Smith', lastVisit: '2025-11-15', status: 'Stable' },
    { id: 2, name: 'Emma Johnson', lastVisit: '2025-11-10', status: 'Improving' },
    { id: 3, name: 'Sarah Williams', lastVisit: '2025-11-08', status: 'Follow-up needed' },
    { id: 4, name: 'Michael Brown', lastVisit: '2025-11-01', status: 'Stable' }
  ];

  // Pending messages from patients
  patientMessages = [
    { id: 1, patientName: 'John Smith', message: 'Can I reschedule my appointment?', time: '30 mins ago', unread: true },
    { id: 2, patientName: 'Emma Johnson', message: 'My symptoms have improved', time: '2 hours ago', unread: true },
    { id: 3, patientName: 'Michael Brown', message: 'Confirming appointment tomorrow', time: '1 day ago', unread: false }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log('[DoctorDashboard] Loaded for doctor:', this.currentUser?.email);
  }
}
