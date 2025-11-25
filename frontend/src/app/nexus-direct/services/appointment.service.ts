import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

export interface Appointment {
  id: number;
  userEmail: string;
  doctorId: number;
  doctorName: string;
  patientId: number;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'SCHEDULED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppointmentListResponse {
  content: Appointment[];
  totalElements: number;
  totalPages: number;
  pageable: any;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  constructor(private apiService: ApiService) {}

  // Get all appointments (paginated)
  getAppointments(page: number = 0, size: number = 10): Observable<AppointmentListResponse> {
    return this.apiService.get<AppointmentListResponse>('/appointments/search/paginated', {
      page,
      size,
      sortBy: 'appointmentDate',
      direction: 'DESC'
    });
  }

  // Search appointments by date range
  searchByDateRange(start: string, end: string, page: number = 0, size: number = 10): Observable<AppointmentListResponse> {
    return this.apiService.get<AppointmentListResponse>('/appointments/search/by-date-range', {
      start,
      end,
      page,
      size
    });
  }

  // Get single appointment by ID
  getAppointmentById(id: number): Observable<Appointment> {
    return this.apiService.get<Appointment>(`/appointments/${id}`);
  }

  // Create new appointment (book)
  bookAppointment(appointment: any): Observable<Appointment> {
    return this.apiService.post<Appointment>('/appointments', appointment);
  }

  // Update appointment
  updateAppointment(id: number, appointment: any): Observable<Appointment> {
    return this.apiService.put<Appointment>(`/appointments/${id}`, appointment);
  }

  // Delete appointment (cancel)
  cancelAppointment(id: number): Observable<any> {
    return this.apiService.delete(`/appointments/${id}`);
  }
}
