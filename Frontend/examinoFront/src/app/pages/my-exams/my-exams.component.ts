import { Component, OnInit } from '@angular/core';
import { ExamResponse, ExamService } from '../../service/exam/exam.service';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { QuestionResponse, QuestionService } from '../../service/question/question.service';

@Component({
  selector: 'app-exam-manage',
  templateUrl: './my-exams.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./my-exams.component.css']
})
export class MyExamsComponent implements OnInit {
  exams: ExamResponse[] = [];
  filteredExams: ExamResponse[] = []
  successMessage = '';
  errorMessage = '';
  examId = ''
  questions: QuestionResponse[] = []
  searchQuery = ''

  // Pagination için
  currentPage = 1;
  itemsPerPage = 7;

  constructor(private location: Location,private examService: ExamService, private questionService: QuestionService, private router: Router, private authService: AuthService) { }

  goBack(){
    this.location.back()
  }

  ngOnInit(): void {
    this.loadExams();
  }
  isModalOpen = false;
  editExam_: ExamResponse = {
    id: "0",
    title: '',
    startTime: '',
    duration: "0",
    questions: [],
    endTime: ''
  };
isQuestionModalOpen = false;
allQuestions: QuestionResponse[] = [];

 openQuestionPoolModal() {
  this.questionService.getAllQuestions().subscribe({
    next: (res) => {
      this.allQuestions = res.reverse();
      this.isQuestionModalOpen = true;
    },
    error: () => {
      alert('Sorular yüklenemedi.');
    }
  });
}

addQuestionToExam(question: QuestionResponse) {
  // Aynı soru zaten eklenmişse tekrar ekleme
  const alreadyExists = this.editExam_.questions.some(q => q.id === question.id);
  if (alreadyExists) {
    alert('Bu soru zaten eklenmiş.');
    return;
  }

  this.editExam_.questions.push(question);
  this.questions.push(question);
}


closeQuestionPoolModal() {
  this.isQuestionModalOpen = false;
}


  openEditModal(exam: ExamResponse) {
    this.editExam_ = { ...exam };  // Kopyala
    // Eğer startTime string ise, datetime-local için uygun format gerekebilir
    this.questionService.getQuestionsByExam(exam.id).subscribe({
      next: (res) => this.questions = res
    })
    this.isModalOpen = true;
  }
  removeQuestion(index: number) {
    this.editExam_.questions.splice(index, 1);
  }

  onSearchChange() {
  const query = this.searchQuery.toLowerCase().trim();

  this.filteredExams = this.exams.filter(exam =>
    exam.title.toLowerCase().includes(query) ||
    exam.startTime.toLowerCase().includes(query) ||
    exam.duration.toString().includes(query)
  );

  this.currentPage = 1;
}


  closeModal() {
    this.isModalOpen = false;
  }

  saveExam() {
    this.examService.updateExam(this.editExam_).subscribe({
      next: () => {
        this.isModalOpen = false;
        this.loadExams();
        alert('Sınav başarıyla güncellendi.');
      },
      error: (err) => {
        alert('Güncelleme başarısız: ' + err.message);
      }
    });
  }

  loadExams() {
    this.examService.getExamsByTeacher().subscribe({
      next: (data) => {
        this.exams = data.reverse();
        this.filteredExams = data
        this.currentPage = 1; // Yeni veride sayfa sıfırlanabilir
      },
      error: () => this.errorMessage = 'Sınavlar yüklenemedi.'
    });
  }

  get pagedExams(): ExamResponse[] {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  return this.filteredExams.slice(startIndex, startIndex + this.itemsPerPage);
}

  get totalPages(): number {
    return Math.ceil(this.exams.length / this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  navigateToProfile() {
    this.router.navigate(['/profile'])
  }

  logout() {
    confirm("Çıkış yapmak istediğinze emin misiniz ?")
    this.authService.logout()
    this.router.navigate(['/login'])
  }
  nextPage() {
    this.goToPage(this.currentPage + 1);
  }
  get emptyRows(): number[] {
    const emptyCount = this.itemsPerPage - this.pagedExams.length;
    return Array(emptyCount).fill(0);
  }

  previousPage() {
    this.goToPage(this.currentPage - 1);
  }

  viewExam(id: number | string) {
    this.router.navigate(['/view-exam', id]);
  }

  editExam(id: number | string) {
    this.router.navigate(['/exam-edit', id]);
  }

  deleteExam(id: string) {
    if (!confirm('Bu sınavı silmek istediğinizden emin misiniz?')) return;

    this.examService.deleteExam(id).subscribe({
      next: () => {
        this.successMessage = 'Sınav başarıyla silindi.';
        this.loadExams();
      },
      error: (err) => {
        this.errorMessage = 'Sınav silinemedi.';
        console.error(err);
      }
    });
  }


}
