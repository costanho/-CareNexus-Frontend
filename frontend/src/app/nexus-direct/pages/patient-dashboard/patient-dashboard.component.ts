import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ServiceHeaderComponent } from '../../../shared/components/service-header/service-header.component';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ServiceHeaderComponent],
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.scss']
})
export class PatientDashboardComponent implements OnInit {

  currentUser: any = null;

  // Patient stats
  upcomingAppointments = 2;
  totalDoctors = 5;
  unreadMessages = 3;
  totalAppointments = 12;

  // Sample appointment data
  appointments = [
    {
      id: 1,
      doctorName: 'Dr. James Wilson',
      specialization: 'Cardiologist',
      date: '2025-11-25',
      time: '10:00 AM',
      status: 'Scheduled',
      icon: '❤️'
    },
    {
      id: 2,
      doctorName: 'Dr. Sarah Ahmed',
      specialization: 'General Practitioner',
      date: '2025-11-28',
      time: '2:00 PM',
      status: 'Scheduled',
      icon: '🩺'
    }
  ];

  // Sample doctor connections
  recentDoctors = [
    { id: 1, name: 'Dr. James Wilson', specialization: 'Cardiologist', icon: '❤️' },
    { id: 2, name: 'Dr. Sarah Ahmed', specialization: 'General Practitioner', icon: '🩺' },
    { id: 3, name: 'Dr. Michael Chen', specialization: 'Dermatologist', icon: '🧴' }
  ];

  // Sample messages
  recentMessages = [
    { id: 1, doctorName: 'Dr. James Wilson', lastMessage: 'Take your medication regularly', time: '2 hours ago', unread: true },
    { id: 2, doctorName: 'Dr. Sarah Ahmed', lastMessage: 'See you at your appointment', time: '1 day ago', unread: false },
    { id: 3, doctorName: 'Dr. Michael Chen', lastMessage: 'Your skin is improving well', time: '3 days ago', unread: false }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log('[PatientDashboard] Loaded for user:', this.currentUser?.email);
  }
}
