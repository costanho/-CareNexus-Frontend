import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

export interface Patient {
  id: number;
  userEmail: string;
  name: string;
  age?: number;
  gender?: string;
  phoneNumber?: string;
  address?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  allergies?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PatientListResponse {
  content: Patient[];
  totalElements: number;
  totalPages: number;
  pageable: any;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private apiService: ApiService) {}

  // Get all patients (paginated)
  getPatients(page: number = 0, size: number = 10): Observable<PatientListResponse> {
    return this.apiService.get<PatientListResponse>('/patients/search/paginated', {
      page,
      size,
      sortBy: 'name',
      direction: 'ASC'
    });
  }

  // Search patients by name
  searchByName(name: string, page: number = 0, size: number = 10): Observable<PatientListResponse> {
    return this.apiService.get<PatientListResponse>('/patients/search/by-name', {
      name,
      page,
      size
    });
  }

  // Search patients by email
  searchByEmail(email: string): Observable<Patient> {
    return this.apiService.get<Patient>('/patients/search/by-email', {
      email
    });
  }

  // Get single patient by ID
  getPatientById(id: number): Observable<Patient> {
    return this.apiService.get<Patient>(`/patients/${id}`);
  }

  // Get current logged-in patient profile
  getCurrentPatient(): Observable<Patient> {
    return this.apiService.get<Patient>('/patients/me');
  }

  // Create new patient
  createPatient(patient: any): Observable<Patient> {
    return this.apiService.post<Patient>('/patients', patient);
  }

  // Update patient
  updatePatient(id: number, patient: any): Observable<Patient> {
    return this.apiService.put<Patient>(`/patients/${id}`, patient);
  }

  // Update current patient profile
  updateCurrentPatient(patient: any): Observable<Patient> {
    return this.apiService.put<Patient>('/patients/me', patient);
  }

  // Delete patient
  deletePatient(id: number): Observable<any> {
    return this.apiService.delete(`/patients/${id}`);
  }
}
