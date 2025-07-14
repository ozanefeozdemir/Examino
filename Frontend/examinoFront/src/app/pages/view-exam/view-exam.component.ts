import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';
import { Exam } from '../../model/exam.model';
import { ExamResponse, ExamService } from '../../service/exam/exam.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuestionResponse, QuestionService } from '../../service/question/question.service';
import { ResultService } from '../../service/result/result.service';
import { ResultsComponent } from '../results/results.component';

@Component({
  selector: 'app-view-exam',
  imports: [FormsModule, CommonModule],
  templateUrl: './view-exam.component.html',
  styleUrl: './view-exam.component.css'
})
export class ViewExamComponent implements OnInit{
  exam?: ExamResponse
  questions?: QuestionResponse[]
  examId?: string |null
  errorMessage: string = ''
  studentList: string[] = []
  teacherName = ''

  constructor(private router: Router, private resultService: ResultService, private questionService: QuestionService, private route: ActivatedRoute, private authService: AuthService, private examService: ExamService) { }

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('id')
    this.examService.getExamById(this.examId).subscribe({
        next: (res) => {
            this.exam = res
        },
        error:(err) => {
          this.errorMessage = err
            console.log("Sınav alınamadı..", err)
        }
    })

    this.questionService.getQuestionsByExam(this.examId).subscribe({
      next: (res) => {
          this.questions = res
      },  
      error: (err) => {
          this.errorMessage = err
          console.log("Sorular yüklenemedi", err)
      }
    })

    this.resultService.getStudentName(this.examId).subscribe({
      next: (res) => {
          this.studentList = res
      },
      error: (err) => {
          this.errorMessage = err
          console.log("Öğrenciler yüklenemedi.. ", err)
      }
    })
    
    this.examService.getTeacherName(this.examId).subscribe({
      next: (res) => {
        this.teacherName = res
      },
      error: (err) => {
        this.errorMessage = err
        console.log("Öğretmen alınamadı...", err)
      }
    })
  }
  navigateToProfile() {
    this.router.navigate(['/profile'])
  }

  logout() {
    confirm("Çıkış yapmak istediğinze emin misiniz ?")
    this.authService.logout()
    this.router.navigate(['/login'])
  }
}
