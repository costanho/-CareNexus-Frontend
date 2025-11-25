import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

export interface Doctor {
  id: number;
  userEmail: string;
  name: string;
  specialization: string;
  licenseNumber: string;
  bio?: string;
  consultationFee?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DoctorListResponse {
  content: Doctor[];
  totalElements: number;
  totalPages: number;
  pageable: any;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  constructor(private apiService: ApiService) {}

  // Get all doctors (paginated)
  getDoctors(page: number = 0, size: number = 10, sortBy: string = 'name', direction: string = 'ASC'): Observable<DoctorListResponse> {
    return this.apiService.get<DoctorListResponse>('/doctors/search/paginated', {
      page,
      size,
      sortBy,
      direction
    });
  }

  // Search doctors by name
  searchByName(name: string, page: number = 0, size: number = 10): Observable<DoctorListResponse> {
    return this.apiService.get<DoctorListResponse>('/doctors/search/by-name', {
      name,
      page,
      size,
      sortBy: 'name',
      direction: 'ASC'
    });
  }

  // Search doctors by specialization
  searchBySpecialization(specialization: string, page: number = 0, size: number = 10): Observable<DoctorListResponse> {
    return this.apiService.get<DoctorListResponse>('/doctors/search/by-specialization', {
      specialization,
      page,
      size,
      sortBy: 'specialization',
      direction: 'ASC'
    });
  }

  // Get single doctor by ID
  getDoctorById(id: number): Observable<Doctor> {
    return this.apiService.get<Doctor>(`/doctors/${id}`);
  }

  // Create new doctor
  createDoctor(doctor: any): Observable<Doctor> {
    return this.apiService.post<Doctor>('/doctors', doctor);
  }

  // Update doctor
  updateDoctor(id: number, doctor: any): Observable<Doctor> {
    return this.apiService.put<Doctor>(`/doctors/${id}`, doctor);
  }

  // Delete doctor
  deleteDoctor(id: number): Observable<any> {
    return this.apiService.delete(`/doctors/${id}`);
  }
}
