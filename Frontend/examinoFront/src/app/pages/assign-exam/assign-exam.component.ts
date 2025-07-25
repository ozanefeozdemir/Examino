import { Component } from '@angular/core';
import { Route, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';
import { ExamResponse, ExamService } from '../../service/exam/exam.service';
import { UserService } from '../../service/user/user.service';
import { User } from '../../model/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-assign-exam',
  imports: [FormsModule, CommonModule],
  templateUrl: './assign-exam.component.html',
  styleUrl: './assign-exam.component.css'
})
// ... diğer importlar ...
export class AssignExamComponent {
  exams: ExamResponse[] = [];
  students: User[] = [];
  selectedExamId: string | null = null;
  selectedStudentIds: number[] = [];
  showModal = false;

  // Sayfalama için ek alanlar
  currentPage: number = 1;
  itemsPerPage: number = 6;

  constructor(
    private router: Router,
    private authService: AuthService,
    private examService: ExamService,
    private userService: UserService,
    private location: Location
  ) { }
  goBack() {
    this.location.back()
  }
  ngOnInit(): void {
    this.examService.getExamsByTeacher().subscribe({
      next: (res) => {
        this.exams = res.reverse();
      }
    });
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    if (confirm("Çıkış yapmak istediğinze emin misiniz ?")) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  openStudentModal(examId: string) {
  this.selectedExamId = examId;
  this.selectedStudentIds = [];

  // 1. Öğrenci listesini ve sınava atanmış öğrencileri aynı anda çek
  forkJoin({
    allStudents: this.userService.getAllUsers('STUDENT'),
    assignedStudents: this.examService.getAssignedStudents(examId)
  }).subscribe({
    next: ({ allStudents, assignedStudents }) => {
      this.students = allStudents.reverse();
      this.selectedStudentIds = assignedStudents.map((s: User) => s.id); // sadece ID'leri al
      this.currentPage = 1;
      this.showModal = true;
    },
    error: (err) => {
      console.error('Modal verileri alınamadı', err);
      alert('Modal verileri yüklenemedi.');
    }
  });
}


  toggleStudent(studentId: number) {
    const index = this.selectedStudentIds.indexOf(studentId);
    if (index > -1) {
      this.selectedStudentIds.splice(index, 1);
    } else {
      this.selectedStudentIds.push(studentId);
    }
  }

  assignStudentsToExam() {
    if (!this.selectedExamId || this.selectedStudentIds.length === 0) return;

    const requests = this.selectedStudentIds.map(studentId =>
      this.examService.assignStudent(this.selectedExamId!.toString(), studentId.toString())
    );

    forkJoin(requests).subscribe({
      next: () => {
        alert("Öğrenciler başarıyla atandı!");
        this.showModal = false;
        this.selectedStudentIds = [];
      },
      error: (err) => {
        console.error("Atama sırasında hata oluştu:", err);
        alert("Atama işlemi sırasında hata oluştu.");
      }
    });
  }

  // Pagination için hesaplama
  get paginatedStudents(): User[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.students.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.students.length / this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  // Sınav listesi için pagination
  currentExamPage: number = 1;
  examsPerPage: number = 6;

  get paginatedExams(): ExamResponse[] {
    const start = (this.currentExamPage - 1) * this.examsPerPage;
    return this.filteredExams.slice(start, start + this.examsPerPage);
  }

  get totalExamPages(): number {
    return Math.ceil(this.filteredExams.length / this.examsPerPage);
  }

  goToExamPage(page: number) {
    if (page >= 1 && page <= this.totalExamPages) {
      this.currentExamPage = page;
    }
  }

  previousExamPage() {
    if (this.currentExamPage > 1) {
      this.currentExamPage--;
    }
  }

  nextExamPage() {
    if (this.currentExamPage < this.totalExamPages) {
      this.currentExamPage++;
    }
  }
  examSearchQuery: string = '';
  get filteredExams(): ExamResponse[] {
    if (!this.examSearchQuery) return this.exams;
    const lower = this.examSearchQuery.toLowerCase();
    return this.exams.filter(exam => exam.title.toLowerCase().includes(lower));
  }

}
