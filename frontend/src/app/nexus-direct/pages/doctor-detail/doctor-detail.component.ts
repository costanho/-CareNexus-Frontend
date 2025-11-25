import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DoctorService, Doctor } from '../../services/doctor.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-doctor-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './doctor-detail.component.html',
  styleUrls: ['./doctor-detail.component.scss']
})
export class DoctorDetailComponent implements OnInit, OnDestroy {
  doctor: Doctor | null = null;
  loading = true;
  error = '';
  doctorId: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private doctorService: DoctorService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.doctorId = parseInt(params['id'], 10);
        if (this.doctorId) {
          this.loadDoctorDetails();
        }
      });
  }

  private loadDoctorDetails(): void {
    if (!this.doctorId) return;

    this.loading = true;
    this.error = '';
    this.doctorService.getDoctorById(this.doctorId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (doctor) => {
          this.doctor = doctor;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load doctor:', err);
          this.error = 'Failed to load doctor details. Please try again.';
          this.loading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
