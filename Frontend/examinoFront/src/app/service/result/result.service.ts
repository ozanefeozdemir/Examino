import { Injectable } from '@angular/core';
import { Result } from '../../model/result.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { StudentAnswer } from '../../model/student-answer.model';
import { Exam } from '../../model/exam.model';

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  headers: HttpHeaders
  baseUrl = "http://localhost:8080/api/results"
  constructor(private http: HttpClient, private authService: AuthService) {
    const token = localStorage.getItem('token');
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getStudentName(examId: string | null): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + '/' + examId)
  }

  getAnswersByStudentIdAndExamId(studentId: string, examId: string): Observable<StudentAnswer[]> {
    const params = new HttpParams().set('studentId', studentId).set('examId', examId);
    return this.http.get<StudentAnswer[]>(`http://localhost:8080/api/student-answers`, { params });
  }

  getResult(): Observable<Result[]> {
    if (this.authService.getUserRole() == 'TEACHER')
      return this.http.get<Result[]>(this.baseUrl + '/teacher', { headers: this.headers });
    else
      return this.http.get<Result[]>(this.baseUrl + '/student', { headers: this.headers });
  }

  getExamFromResult( resultId: string): Observable<Exam>{
    const params = new HttpParams().set('resultId', resultId)
    return this.http.get<Exam>(this.baseUrl + '/getExam', { params })
  }

}
