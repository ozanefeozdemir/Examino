import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamResponse, ExamService } from '../../service/exam/exam.service';
import { QuestionResponse, QuestionService } from '../../service/question/question.service';
import { StudentAnswerService } from '../../service/student-answer/student-answer.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-take-exam',
  templateUrl: './take-exam.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./take-exam.component.css']
})
export class TakeExamComponent implements OnInit, OnDestroy {
  examId!: string | null;
  exam!: ExamResponse;
  questions: QuestionResponse[] = [];
  currentIndex = 0;
  answers: number[] = [];
  formattedTime = '';
  submitted = false;
  intervalId: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private authService: AuthService,
    private questionService: QuestionService,
    private answerService: StudentAnswerService
  ) {}

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('id');
    this.loadExamData()
    this.setupBeforeUnloadGuard();
  }

  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', this.beforeUnloadListener);
    clearInterval(this.intervalId);
  }

  
  loadExamData() {
    this.examService.getExamById(this.examId).subscribe({
      next: (data) => {
        this.exam = data;
        this.answers = new Array(this.exam.questions.length).fill(-1);
        this.questionService.getQuestionsByExam(this.examId).subscribe({
          next: (res) => {
            this.questions = res;
            this.startTimer(Number(this.exam.duration));
          },
          error: () => alert("Sorular yüklenemedi.")
        });
      },
      error: () => alert("Sınav yüklenemedi.")
    });
  }

  startTimer(durationMinutes: number) {
    const key = `exam-${this.examId}-startTime`;
    let startTime: number;

    const savedStart = localStorage.getItem(key);
    if (savedStart) {
      startTime = parseInt(savedStart);
    } else {
      startTime = Date.now();
      localStorage.setItem(key, startTime.toString());
    }

    const durationInSeconds = durationMinutes * 60;

    this.intervalId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = durationInSeconds - elapsed;

      if (remaining <= 0) {
        clearInterval(this.intervalId);
        this.formattedTime = '00:00';
        alert('Süre doldu. Sınav otomatik olarak gönderiliyor.');
        this.submitExam();
      } else {
        const m = Math.floor(remaining / 60);
        const s = remaining % 60;
        this.formattedTime = `${this.pad(m)}:${this.pad(s)}`;
      }
    }, 1000);
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  selectAnswer(index: number, opt: number) {
    this.answers[index] = opt;
  }

  isAnswered(i: number) {
    return this.answers[i] !== -1;
  }

  previous() {
    if (this.currentIndex > 0) this.currentIndex--;
  }

  next() {
    if (this.currentIndex < this.exam.questions.length - 1) this.currentIndex++;
  }

  goToQuestion(i: number) {
    this.currentIndex = i;
  }

  submitExam() {
    if (!confirm("Sınavı bitirmek istiyor musunuz?")) return;

    this.submitted = true;
    clearInterval(this.intervalId);
    localStorage.removeItem(`exam-${this.examId}-startTime`);

    const payload = this.questions.map((q, i) => ({
      questionId: q.id,
      answerText: this.answers[i] !== -1 ? q.options[this.answers[i]] : ''
    }));

    this.answerService.submitAnswers(this.examId!, payload).subscribe({
      next: () => {
        alert('Sınav tamamlandı.');
        this.router.navigate(['/home']);
      },
      error: () => alert('Sınav gönderilemedi.')
    });
  }

  beforeUnloadListener = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = 'Sınavdan çıkarsanız iptal edilecektir!';
  };

  setupBeforeUnloadGuard() {
    window.addEventListener('beforeunload', this.beforeUnloadListener);
  }
}
