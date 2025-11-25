import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientService, Patient } from '../../services/patient.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  patient: Patient | null = null;
  loading = true;
  editing = false;
  submitted = false;
  error = '';
  success = '';
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private patientService: PatientService
  ) {
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      age: ['', [Validators.min(1), Validators.max(150)]],
      gender: ['', Validators.required],
      phoneNumber: ['', [Validators.pattern(/^[0-9\-\+\(\)\s]+$/)]],
      address: [''],
      emergencyContact: [''],
      medicalHistory: [''],
      allergies: ['']
    });
  }

  ngOnInit(): void {
    this.loadPatientProfile();
  }

  private loadPatientProfile(): void {
    this.loading = true;
    this.patientService.getCurrentPatient()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (patient) => {
          this.patient = patient;
          this.populateForm(patient);
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load patient:', err);
          this.error = 'Failed to load patient profile';
          this.loading = false;
        }
      });
  }

  private populateForm(patient: Patient): void {
    this.profileForm.patchValue({
      name: patient.name || '',
      age: patient.age || '',
      gender: patient.gender || '',
      phoneNumber: patient.phoneNumber || '',
      address: patient.address || '',
      emergencyContact: patient.emergencyContact || '',
      medicalHistory: patient.medicalHistory || '',
      allergies: patient.allergies || ''
    });
  }

  toggleEdit(): void {
    this.editing = !this.editing;
    this.submitted = false;
    this.error = '';
    this.success = '';
  }

  get f() {
    return this.profileForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = '';

    if (this.profileForm.invalid || !this.patient) {
      return;
    }

    this.patientService.updateCurrentPatient(this.profileForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          this.patient = updated;
          this.success = 'Profile updated successfully!';
          this.editing = false;
          setTimeout(() => {
            this.success = '';
          }, 3000);
        },
        error: (err) => {
          console.error('Failed to update profile:', err);
          this.error = 'Failed to update profile. Please try again.';
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
