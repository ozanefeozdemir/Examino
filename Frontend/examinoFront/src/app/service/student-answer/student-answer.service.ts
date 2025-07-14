import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StudentAnswerService {
  headers: HttpHeaders
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
   }
  submitAnswers(examId: string | null, answers: { questionId: number | string, answerText: string }[]) {
    return this.http.post('http://localhost:8080/api/student-answers/' + examId, answers, {
      headers: this.headers

    });
  }

}
