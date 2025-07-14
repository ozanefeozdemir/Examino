import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface QuestionRequest {
  text: string;
  options: string[];
  difficulty: string
  correctOptionIndex: number;
}

export interface QuestionResponse {
  id: string;
  text: string;
  options: string[];
  difficulty: string
  correctOptionIndex: number;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private baseUrl = 'http://localhost:8080/api/questions';

  constructor(private http: HttpClient) { }

  createQuestion(question: QuestionRequest): Observable<QuestionResponse> {
    return this.http.post<QuestionResponse>(this.baseUrl + '/add', question, {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  addQuestionToExam(question: QuestionRequest, examId: string): Observable<QuestionResponse> {
    return this.http.post<QuestionResponse>(`${this.baseUrl}/add/` + examId, question);
  }

  getAllQuestions(): Observable<QuestionResponse[]> {
    return this.http.get<QuestionResponse[]>(`${this.baseUrl}`);
  }

  getQuestionsByExam(examId: string | null): Observable<QuestionResponse[]> {
    return this.http.get<QuestionResponse[]>(this.baseUrl + '/exam/' + examId)
  }

  deleteQuestion(questionId: string): Observable<void> {
    return this.http.delete<void>(this.baseUrl + '/' + questionId);
  }

  updateQuestion(id: string, updated: QuestionRequest): Observable<QuestionResponse> {
    return this.http.put<QuestionResponse>(`${this.baseUrl}/${id}`, updated);
  }
}
