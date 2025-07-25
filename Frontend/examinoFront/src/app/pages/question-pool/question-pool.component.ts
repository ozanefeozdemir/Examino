import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';
import { QuestionService, QuestionResponse, QuestionRequest } from '../../service/question/question.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-question-pool',
  templateUrl: './question-pool.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./question-pool.component.css']
})
export class QuestionPoolComponent implements OnInit {
  questions: QuestionResponse[] = [];
  filteredQuestions: QuestionResponse[] = [];
  searchTerm = '';
  pageSize = 4;
  

  showModal = false;
  editingQuestion: QuestionResponse | null = null;
  updatedQuestion: QuestionRequest = {
    text: '',
    options: [],
    correctOptionIndex: 0,
    difficulty: 'Kolay'
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private questionService: QuestionService,
    private location: Location
  ) { }

  goBack(){
    this.location.back()
  }

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.questionService.getAllQuestions().subscribe({
      next: (data) => {
        this.questions = data.reverse();
        this.filterQuestions();
      },
      error: () => alert('Soru havuzu yüklenemedi.')
    });
  }

onOptionChange(index: number, value: string) {
  this.updatedQuestion.options[index] = value;
}

trackByIndex(index: number, item: any): number {
  return index;
}


  // Pagination ayarları
  itemsPerPage = 9; 
  currentPage = 1;
  totalPages = 1;
  pagedQuestions: QuestionResponse[] = [];

  filterQuestions(): void {
    const term = this.searchTerm ? this.searchTerm.toLowerCase() : '';
    this.filteredQuestions = this.questions.filter(q =>
      q.text && q.text.toLowerCase().includes(term)
    );
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredQuestions.length / this.itemsPerPage);
    this.goToPage(this.currentPage);
  }

  goToPage(page: number): void {
    if (page < 1) page = 1;
    else if (page > this.totalPages) page = this.totalPages;

    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    this.pagedQuestions = this.filteredQuestions.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  get paginatedQuestions(): QuestionResponse[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredQuestions.slice(start, start + this.pageSize);
  }

  changePage(offset: number): void {
    const newPage = this.currentPage + offset;
    const totalPages = Math.ceil(this.filteredQuestions.length / this.pageSize);
    if (newPage >= 1 && newPage <= totalPages) {
      this.currentPage = newPage;
    }
  }

  openEditModal(question: QuestionResponse): void {
    this.editingQuestion = question;
    this.updatedQuestion = {
      text: question.text,
      options: [...question.options],
      correctOptionIndex: question.correctOptionIndex,
      difficulty: question.difficulty
    };
    this.showModal = true;
  }

  updateQuestion(): void {
    if (!this.editingQuestion) return;
    this.questionService.updateQuestion(this.editingQuestion.id, this.updatedQuestion).subscribe({
      next: () => {
        this.showModal = false;
        this.loadQuestions();
      },
      error: () => alert('Güncelleme başarısız oldu.')
    });
  }

  deleteQuestion(): void {
    if (!this.editingQuestion) return;
    if (!confirm("Bu soruyu silmek istediğinize emin misiniz?")) return;
    this.questionService.deleteQuestion(this.editingQuestion.id).subscribe({
      next: () => {
        this.showModal = false;
        this.loadQuestions();
      },
      error: () => alert('Silme başarısız.')
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.editingQuestion = null;
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    confirm("Çıkış yapmak istediğinze emin misiniz ?")
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
