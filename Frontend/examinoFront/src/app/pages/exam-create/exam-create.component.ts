import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionRequest, QuestionResponse, QuestionService } from '../../service/question/question.service';
import { ExamService } from '../../service/exam/exam.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { AuthService } from '../../service/auth/auth.service';
import { User } from '../../model/user.model';
import { ExamRequest } from '../../service/exam/exam.service';
@Component({
  selector: 'app-exam-create',
  templateUrl: './exam-create.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./exam-create.component.css']
})


export class ExamCreateComponent implements OnInit {
  examTitle = '';
  startTime = new Date();
  endTime = new Date();
  duration = ''
  examRequest!: ExamRequest
  searchQuery: string = '';

  // teacherId = 0

  allQuestions: QuestionResponse[] = [];
  selectedQuestions: QuestionResponse[] = [];

  // Yeni soru ekleme formu
  newQuestionText = '';
  newOptions: string[] = ['', '', '', ''];
  newCorrectIndex = 0;
  currentPage = 1
  itemsPerPage = 5
  questionCount = 10;

  difficultyPercentages: { [key: string]: number } = {
    'Kolay': 0,
    'Orta': 0,
    'Zor': 0
  };

  loading = false;
  successMessage = '';
  errorMessage = '';
  percentageOptions!: Array<Number>

  constructor(private examService: ExamService, private questionService: QuestionService, private router: Router,
    private authService: AuthService, private location: Location
  ) { }

  goBack() {
    this.location.back()
  }

  ngOnInit(): void {
    this.percentageOptions = Array.from({ length: 11 }, (_, i) => i * 10); // [0, 5, 10, ..., 100]

    this.loadQuestionPool();

  }
  filteredQuestions(): QuestionResponse[] {
    const filtered = this.filteredQuestionsRaw();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  getDifficultyKeys(): string[] {
    return Object.keys(this.difficultyPercentages);
  }


  getTotalPages(): number {
    return Math.ceil(this.filteredQuestionsRaw().length / this.itemsPerPage);
  }
  filteredQuestionsRaw(): QuestionResponse[] {
    if (!this.searchQuery.trim()) {
      return this.allQuestions;
    }
    return this.allQuestions.filter(q =>
      q.text && q.text.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  optionCount: number = 4;

  updateOptionCount() {
    const count = Math.max(2, Math.min(10, this.optionCount)); // min 2, max 10 sınırı
    this.newOptions = Array.from({ length: count }, (_, i) => this.newOptions[i] || '');
    if (this.newCorrectIndex >= count) {
      this.newCorrectIndex = 0;
    }
  }
  navigateToProfile() {
    this.router.navigate(['/profile'])
  }

  logout() {
    confirm("Çıkış yapmak istediğinze emin misiniz ?")
    this.authService.logout()
    alert("Çıkış yapıldı")
    this.router.navigate(['/login'])
  }
  onSearchChange() {
    this.currentPage = 1;
  }

  clearSearchBox() { this.searchQuery = "" }

  goToPage(page: number) {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  previousPage() {
    this.goToPage(this.currentPage - 1);
  }


  trackByIndex(index: number, item: any): number {
    return index;
  }


  loadQuestionPool() {
    this.questionService.getAllQuestions().subscribe({
      next: (questions) => {
        this.allQuestions = questions;
      },
      error: () => {
        this.errorMessage = 'Soru havuzu yüklenemedi.';
      }
    });
  }

  toggleQuestionSelection(question: QuestionResponse) {
    const index = this.selectedQuestions.findIndex(q => q.id === question.id);
    if (index > -1) {
      this.selectedQuestions.splice(index, 1); // kaldır
    } else {
      this.selectedQuestions.push(question); // ekle
    }
  }

  isQuestionSelected(id: string): boolean {
    return this.selectedQuestions.some(q => q.id === id);
  }

  navigateToAssignExam(){
    this.router.navigate(["/assign-exam"])
  }
  getTotalDifficulty(): number {
  return Object.values(this.difficultyPercentages).reduce((a, b) => a + b, 0);
}


  createExam_() {
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const totalPercent = Object.values(this.difficultyPercentages).reduce((a, b) => a + b, 0);
    if (totalPercent !== 100) {
      console.log(totalPercent)
      this.errorMessage = 'Zorluk yüzdeleri toplamı %100 olmalıdır.';
      this.loading = false;
      return;
    }

    if (!this.startTime) {
      this.errorMessage = 'Başlangıç zamanı girilmedi.';
      this.loading = false;
      return;
    }
    if (!this.duration) {
      this.errorMessage = 'Süre girilmedi.';
      this.loading = false;
      return;
    }

    const startTimeDate = new Date(this.startTime);
    const isoStartTime = startTimeDate.toISOString().slice(0, 19);  // Örn: "2025-07-07T13:30:00"

    const examRequest = {
      title: this.examTitle,
      startTime: isoStartTime,
      duration: parseInt(this.duration.toString()),
      questionCount: this.questionCount,
      difficultyPercentages: this.difficultyPercentages
    };

    const teacherEmail = this.authService.getUserEmail();
    this.examService.createExamWithAutoQuestions(examRequest, teacherEmail).subscribe({
      next: (res) => {
        this.successMessage = 'Sınav başarıyla oluşturuldu!';
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Sınav oluşturulamadı: ' + (err.error?.message || 'Sunucu hatası');
        this.loading = false;
      }
    });
  }




}
