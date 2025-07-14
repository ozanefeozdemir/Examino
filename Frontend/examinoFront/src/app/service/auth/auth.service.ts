import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';
import { User } from '../../model/user.model';

export interface LoginRequest {
  email: string;
  password: string; 
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: string
}

/*export interface DecodedToken {
  sub: string;                      
  role: string;
  fullName: string;
  exp: number;                      
  iat: number;
}*/
export interface DecodedToken {
  sub: string;             // isim
  roles: string[];         // ['TEACHER']
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(request: LoginRequest): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, request).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);

        const decoded = this.decodeToken(response.token);
        localStorage.setItem('role', decoded.roles[0]);
        //localStorage.setItem('fullName', decoded.fullName);
        localStorage.setItem('email', decoded.sub);
      })
    );
  }

  
  getUserFullName(): string | null {
  const token = this.getToken();
  if (!token) return null;

  const decoded = this.decodeToken(token);
  return decoded.sub; 
}

getUserRole(): string | null {
 /* const token = this.getToken();
  if (!token) return null;

  const decoded = this.decodeToken(token);
  return decoded.roles?.[0] || null; // ilk rol*/
  return localStorage.getItem('role')
}

  
  register(request: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, request);
  }

  getCurrentUser(): Observable<User>{
    return this.http.get<User>("http://localhost:8080/api/users/email/" + this.getUserEmail())
  }

  private decodeToken(token: string): DecodedToken {
    return jwtDecode<DecodedToken>(token);
  }

  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;
    return this.decodeToken(token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserEmail(): string | null {
    return localStorage.getItem('email');
  }
/*
  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  getUserFullName(): string | null {
    return localStorage.getItem('fullName');
  }*/

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = this.decodeToken(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp > now;
    } catch (e) {
      return false;
    }
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
