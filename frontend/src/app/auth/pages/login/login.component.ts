import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe(
      (response) => {
        console.log('Login successful!', response);

        // Get user role and redirect to appropriate profile landing page
        const role = this.authService.getCurrentRole();
        console.log('[LoginComponent] User role:', role);

        let redirectUrl = '/service-selection'; // fallback

        // Handle both ROLE_* and * formats (backend returns PATIENT, DOCTOR, ADMIN without ROLE_ prefix)
        if (role === 'ROLE_PATIENT' || role === 'PATIENT') {
          redirectUrl = '/patient/profile';
        } else if (role === 'ROLE_DOCTOR' || role === 'DOCTOR') {
          redirectUrl = '/doctor/profile';
        } else if (role === 'ROLE_ADMIN' || role === 'ADMIN') {
          redirectUrl = '/admin/profile';
        }

        console.log('[LoginComponent] Redirecting to:', redirectUrl);
        this.router.navigate([redirectUrl]);
      },
      (error) => {
        console.error('Login failed:', error);
        this.error = error.error?.error || 'Login failed. Please check your credentials.';
        this.loading = false;
      }
    );
  }
}
