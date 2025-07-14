import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from '../../model/question.model';
import { QuestionRequest, QuestionResponse, QuestionService } from '../question/question.service';
import { Exam } from '../../model/exam.model';

export interface ExamRequest {
  title: string;
  startTime: Date;
  duration: string
  endTime: Date;
  questions: { id: number | string }[]
}

export interface ExamResponse {
  id: string;
  title: string;
  startTime: string;
  duration: string
  endTime: string;
  questions: { id: number | string }[]
}



@Injectable({
  providedIn: 'root'
})
export class ExamService {

  private baseUrl = 'http://localhost:8080/api/exams';
  private headers: HttpHeaders;
  constructor(private http: HttpClient, private questionService: QuestionService) {
    const token = localStorage.getItem('token');
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  createExam(examData: ExamRequest): Observable<ExamResponse> {
    return this.http.post<ExamResponse>(`${this.baseUrl}`, examData, { headers: this.headers });
  }

  getAllExams(): Observable<ExamResponse[]> {
    return this.http.get<ExamResponse[]>(this.baseUrl)
  }
  canTakeExam(examId: string, email: string | null): Observable<boolean> {
    return this.http.get<boolean>(`http://localhost:8080/api/exams/${examId}/can-take?studentEmail=${email}`);
  }

  createExamWithAutoQuestions(request: any, email: string | null): Observable<any> {
    return this.http.post(
      `http://localhost:8080/api/exams/auto?teacherEmail=${email}`, request
    );
  }

  addQuestionToExam(exam: Exam, newQuestion: QuestionRequest): Observable<QuestionResponse> {
    return this.questionService.addQuestionToExam(newQuestion, exam.id)
  }
  getTeacherName(examId: string | null): Observable<string> {
    return this.http.get<string>(this.baseUrl + '/a/' + examId, { responseType: 'text' as 'json' })
  }
  getExamsByTeacher(): Observable<ExamResponse[]> {
    return this.http.get<ExamResponse[]>(this.baseUrl + '/my', { headers: this.headers })
  }

  getExamsByTeacherEmail(email: string | null): Observable<ExamResponse[]> {
    return this.http.get<ExamResponse[]>(`${this.baseUrl}/teacher/${email}`);
  }

  getExamById(id: string | null): Observable<ExamResponse> {
    return this.http.get<ExamResponse>(`${this.baseUrl}/${id}`);
  }

  updateExam(exam: ExamResponse): Observable<ExamResponse> {
    return this.http.put<ExamResponse>(this.baseUrl + '/' + exam.id, exam, { headers: this.headers })
  }

  deleteExam(id: string): Observable<void> {
    return this.http.delete<void>(this.baseUrl + '/' + id, { headers: this.headers })
  }

  assignStudent(examId: string | any, studentId: string | any): Observable<void> {

    const params = new HttpParams()
      .set('examId', examId)
      .set('studentId', studentId);

    return this.http.post<void>(this.baseUrl + '/assign', params);
  }

  getAssignedExams(studentId: string | null): Observable<ExamResponse[]> {
    return this.http.get<ExamResponse[]>(`${this.baseUrl}/assigned?studentId=${studentId}`);
  }



}
