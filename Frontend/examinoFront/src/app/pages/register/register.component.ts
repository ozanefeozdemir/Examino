import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from  '../../service/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';
  role = ''  ;
  loading = false;
  errorMessage = '';
  teacherCode = '';
  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.loading = true;
    this.authService.register({
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      role: this.role
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Kayıt başarısız';
      }
    });
  }
}
