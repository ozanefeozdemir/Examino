import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../model/user.model';
import { HttpClient, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = 'http://localhost:8080/api/users'
  constructor(private router: Router, private http: HttpClient) { }

  getAllUsers(role?: string): Observable<User[]> {
    const url = role ? `${this.baseUrl}?role=${role}` : this.baseUrl;
    return this.http.get<User[]>(url);
  }
}
