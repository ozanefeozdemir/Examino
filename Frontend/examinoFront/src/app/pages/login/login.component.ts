import { Component } from '@angular/core';
import { AuthService, LoginRequest } from '../../service/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.errorMessage = '';
    this.loading = true;

    const loginRequest: LoginRequest = {
      email: this.email,
      password: this.password
    };

    this.authService.login(loginRequest).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/home']); // Giriş başarılıysa anasayfaya yönlendir
      },
      error: (err) => {
        
        this.errorMessage = err.error?.message || 'Kullanıcı bilgileri hatalı';
      }
    });
  }
}
