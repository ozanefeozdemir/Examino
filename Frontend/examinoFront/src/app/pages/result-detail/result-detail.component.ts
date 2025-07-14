import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';
import { ResultService } from '../../service/result/result.service';
import { StudentAnswer } from '../../model/student-answer.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Result } from '../../model/result.model';
import { Exam } from '../../model/exam.model';

@Component({
  selector: 'app-result-detail',
  templateUrl: './result-detail.component.html',
  imports: [FormsModule, CommonModule],
  styleUrl: './result-detail.component.css',
})
export class ResultDetailComponent implements OnInit {
  resultId: string | any;
  result!: Result[]
  studentId: string | any
  exam!: Exam
  studentAnswers: StudentAnswer[] = [];
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private resultService: ResultService
  ) { }

  ngOnInit(): void {
    this.resultId = this.route.snapshot.paramMap.get('resultId');
    this.studentId = this.route.snapshot.paramMap.get('studentId');

    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        //this.studentId = res.id.toString();
        
        this.resultService.getExamFromResult(this.resultId).subscribe({
          next: (res) => {
            this.exam = res;
            this.loadResultDetail();
          },
          error: (err) => {
            console.log('Sınav bilgisi alınamadı', err);
            this.errorMessage = 'Sınav bilgisi yüklenemedi.';
          }
        });
      },
      error: (err) => {
        console.error('Kullanıcı bilgisi alınamadı', err);
        this.errorMessage = 'Kullanıcı bilgisi alınamadı.';
      }
    });
  }


  loadResultDetail() {
    this.resultService.getAnswersByStudentIdAndExamId(this.studentId, this.exam.id).subscribe({
      next: (data) => {
        this.studentAnswers = data;
      },
      error: () => {
        this.errorMessage = 'Sonuç detayı yüklenemedi.';
      },
    });
  }

  isCorrect(selected: number, correct: number): boolean {
    return selected === correct;
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
