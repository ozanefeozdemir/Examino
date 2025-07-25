import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../model/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = 'http://localhost:8080/api/users'
  constructor(private http: HttpClient) { }

  updateUser(id: string, user: User): Observable<User>{
    return this.http.put<User>(this.baseUrl + '/' + id, user)
  }

  getAllUsers(role?: string): Observable<User[]> {
    const url = role ? `${this.baseUrl}?role=${role}` : this.baseUrl;
    return this.http.get<User[]>(url);
  }
  
}
