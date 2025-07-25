import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionRequest, QuestionResponse, QuestionService } from '../../service/question/question.service';
import { ExamService } from '../../service/exam/exam.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { AuthService } from '../../service/auth/auth.service';
import { User } from '../../model/user.model';
import * as XLSX from 'xlsx';
import { ExamRequest } from '../../service/exam/exam.service';
@Component({
  selector: 'app-exam-create',
  templateUrl: './question-create.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./question-create.component.css']
})
export class QuestionCreateComponent implements OnInit {
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
  newDifficulty: string = '';

  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private examService: ExamService, private questionService: QuestionService, private router: Router,
    private authService: AuthService, private location: Location
  ) { }

  goBack(){
    this.location.back()
  }

  ngOnInit(): void {
    this.loadQuestionPool();

  }
  filteredQuestions(): QuestionResponse[] {
    const filtered = this.filteredQuestionsRaw();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(startIndex, startIndex + this.itemsPerPage);
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

  createExam_() {
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const questionsPayload = this.selectedQuestions.map(q => ({ id: q.id }));
    const examRequest: ExamRequest = {
      title: this.examTitle,
      startTime: this.startTime,
      endTime: this.endTime,
      duration: this.duration,
      questions: questionsPayload
    };
    this.examService.createExam(examRequest).subscribe({
      next: (response) => {
        this.successMessage = 'Sınav başarıyla oluşturuldu!';
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Sınav oluşturulamadı. Hata: ' + (err?.error?.message || 'Bilinmeyen hata');
        console.error('Sınav oluşturma hatası:', err, examRequest);
        this.loading = false;
      }
    })
    /*
      this.examService.createExam({
        title: this.examTitle,
        startTime: this.startTime,
        endTime: this.endTime,
        questions: questionsPayload
        
      }).subscribe({
        next: () => {
          
          this.successMessage = 'Sınav başarıyla oluşturuldu!';
          this.router.navigate(['/home']);
        },
        error: (err) => {
          
          this.errorMessage = 'Sınav oluşturulamadı.';
          console.log(questionsPayload, this.errorMessage, err, this.startTime, this.examTitle, )
          console.log("Role: "+this.authService.getDecodedToken())
          this.loading = false;
        }
      });*/
  }


  addQuestionToPool() {
  if (!this.newQuestionText || this.newOptions.some(opt => !opt) || !this.newDifficulty) {
    this.errorMessage = 'Soru, tüm seçenekler ve zorluk seviyesi doldurulmalıdır.';
    return;
  }

  const newQuestion: QuestionRequest = {
    text: this.newQuestionText,
    options: [...this.newOptions],
    correctOptionIndex: this.newCorrectIndex,
    difficulty: this.newDifficulty // <-- yeni alan
  };

  this.questionService.createQuestion(newQuestion).subscribe({
    next: (createdQuestion) => {
      this.allQuestions.push(createdQuestion); // Havuzu güncelle
      this.successMessage = 'Soru havuzuna eklendi.';
      // form temizle
      this.newQuestionText = '';
      this.newOptions = ['', '', '', ''];
      this.newCorrectIndex = 0;
      this.newDifficulty = '';
    },
    error: () => {
      this.errorMessage = 'Soru eklenemedi.';
    }
  });
}


handleFileInput(event: any) {
  const file: File = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e: any) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

    // İlk satırı başlık kabul et, kalan satırlar veri
    const questionRows = jsonData.slice(1);

    questionRows.forEach((row, index) => {
      // Her satır: [soruMetni, seçenek1, seçenek2, seçenek3, seçenek4, doğruIndex, zorluk]
      if (row.length < 7) return;

      const [text, ...rest] = row;
      const options = rest.slice(0, 4);
      const correctOptionIndex = parseInt(rest[4]);
      const difficulty = rest[5];

      const question: QuestionRequest = {
        text: text,
        options: options,
        correctOptionIndex: correctOptionIndex,
        difficulty: difficulty
      };

      this.questionService.createQuestion(question).subscribe({
        next: () => {
          console.log(`Soru eklendi: ${text}`);
        },
        error: () => {
          console.error(`Soru eklenemedi: ${text}`);
        }
      });
    });

    alert('Sorular başarıyla eklendi');
    this.loadQuestionPool(); // Havuzu güncelle
  };

  reader.readAsArrayBuffer(file);
}

}
