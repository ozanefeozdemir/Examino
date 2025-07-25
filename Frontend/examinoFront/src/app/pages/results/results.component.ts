import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Result } from '../../model/result.model';
import { ResultService } from '../../service/result/result.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  results: Result[] = [];
  filteredResults: Result[] = [];
  errorMessage = '';

  searchQuery = ''; // tek arama kutusu

  // sıralama için
  sortField: keyof Result | 'studentName' | 'examTitle' | 'teacherName' | 'solveDate' = 'solveDate';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(private resultService: ResultService, private router: Router, private authService: AuthService, private location: Location) { }
  goBack() {
    this.location.back()
  }

  ngOnInit(): void {
    this.loadResults();
  }
  navigateToProfile() {
    this.router.navigate(['/profile'])
  }
  get emptyRows(): number[] {
    const emptyCount = this.pageSize - this.pagedResults.length;
    return Array(emptyCount).fill(0);
  }

  logout() {
    confirm("Çıkış yapmak istediğinze emin misiniz ?")
    this.authService.logout()
    alert("Çıkış yapıldı")
    this.router.navigate(['/login'])
  }

  loadResults() {
    this.resultService.getResult().subscribe({
      next: (data) => {
        this.results = data.reverse();
        this.applyFilterAndSort();
      },
      error: () => {
        this.errorMessage = 'Sonuçlar yüklenemedi.';
      }
    });
  }
  updatePagedResults() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedResults = this.filteredResults.slice(start, end);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagedResults();
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedResults();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedResults();
    }
  }

  // Pagination ayarları
  pageSize = 5; // Her sayfada gösterilecek sonuç sayısı
  currentPage = 1;
  totalPages = 1;
  pagedResults: Result[] = []; // Şu anki sayfadaki veriler

  applyFilterAndSort() {
    const query = this.searchQuery.toLowerCase().trim();

    this.filteredResults = this.results.filter(r =>
      r.student.fullName.toLowerCase().includes(query) ||
      r.exam.title.toLowerCase().includes(query) ||
      r.exam.teacher.fullName.toLowerCase().includes(query)
    );

    this.filteredResults.sort((a, b) => {
      let valA: any;
      let valB: any;

      switch (this.sortField) {
        case 'studentName':
          valA = a.student.fullName.toLowerCase();
          valB = b.student.fullName.toLowerCase();
          break;
        case 'teacherName':
          valA = a.exam.teacher.fullName.toLowerCase();
          valB = b.exam.teacher.fullName.toLowerCase();
          break;
        case 'examTitle':
          valA = a.exam.title.toLowerCase();
          valB = b.exam.title.toLowerCase();
          break;
        case 'correctAnswers':
          valA = a.correctAnswers;
          valB = b.correctAnswers;
          break;
        case 'totalQuestions':
          valA = a.totalQuestions;
          valB = b.totalQuestions;
          break;
        case 'score':
          valA = a.score;
          valB = b.score;
          break;
        case 'solveDate':
          valA = new Date(a.solveDate).getTime();
          valB = new Date(b.solveDate).getTime();
          break;
        default:
          valA = '';
          valB = '';
      }

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.totalPages = Math.ceil(this.filteredResults.length / this.pageSize);
    this.currentPage = 1;
    this.updatePagedResults();
  }


  onSearchChange() {
    this.applyFilterAndSort();
  }

  onSort(field: keyof Result | 'studentName' | 'examTitle' | 'solveDate' | 'teacherName') {
    if (this.sortField === field) {
      // Aynı alana tıklanırsa yön değiştir
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilterAndSort();
  }

  viewResultDetail(resultId: string, studentId: string) {
    this.router.navigate(['/result-detail', resultId, studentId]);
  }

  get wrongAnswers(): (result: Result) => number {
    return (result) => result.totalQuestions - result.correctAnswers;
  }


}

