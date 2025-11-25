import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DoctorService, Doctor, DoctorListResponse } from '../../services/doctor.service';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.scss']
})
export class DoctorListComponent implements OnInit, OnDestroy {
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  loading = true;
  error = '';
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  searchTerm = '';
  selectedSpecialization = '';
  specializations = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'General Practice',
    'Surgery'
  ];

  private search$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadDoctors();
    this.setupSearch();
  }

  private setupSearch(): void {
    this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          this.loading = true;
          if (term.trim()) {
            return this.doctorService.searchByName(term, 0, this.pageSize);
          } else if (this.selectedSpecialization) {
            return this.doctorService.searchBySpecialization(this.selectedSpecialization, 0, this.pageSize);
          } else {
            return this.doctorService.getDoctors(0, this.pageSize);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => this.handleResponse(response),
        error: (err) => this.handleError(err)
      });
  }

  private loadDoctors(): void {
    this.loading = true;
    this.error = '';
    this.doctorService.getDoctors(this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.handleResponse(response),
        error: (err) => this.handleError(err)
      });
  }

  private handleResponse(response: DoctorListResponse): void {
    this.doctors = response.content || [];
    this.filteredDoctors = this.doctors;
    this.totalElements = response.totalElements;
    this.totalPages = response.totalPages;
    this.loading = false;
  }

  private handleError(err: any): void {
    console.error('Failed to load doctors:', err);
    this.error = 'Failed to load doctors. Please try again.';
    this.loading = false;
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 0;
    this.search$.next(term);
  }

  onSpecializationChange(specialization: string): void {
    this.selectedSpecialization = specialization;
    this.currentPage = 0;
    this.search$.next(this.searchTerm);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadDoctors();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadDoctors();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
