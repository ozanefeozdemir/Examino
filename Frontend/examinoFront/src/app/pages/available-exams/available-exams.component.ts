import { Component, OnInit } from '@angular/core';
import { ExamResponse, ExamService } from '../../service/exam/exam.service';
import { AuthService } from '../../service/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { TakeExamComponent } from '../take-exam/take-exam.component';
import { Exam } from '../../model/exam.model';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-available-exams',
  templateUrl: './available-exams.component.html',
  styleUrls: ['./available-exams.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class AvailableExamsComponent implements OnInit {
  availableExams: ExamResponse[] = [];
  filteredExams: ExamResponse[] = [];
  searchQuery: string = '';
  errorMessage = '';
  exam!: ExamResponse
  a!: TakeExamComponent
  canTake = true
  currentUser!: User


  constructor(
    private examService: ExamService,
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) { }

  goBack(){
    this.location.back()
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (val) => {this.currentUser = val

    this.examService.getAssignedExams(String(this.currentUser.id)).subscribe({
      next: (data) => {
        this.availableExams = data.reverse();
        this.filteredExams = [...data];
      },
      error: () => this.errorMessage = 'Sınavlar yüklenemedi.'
    });}
    })
  }

itemsPerPage = 6;
currentPage = 1;

get pagedExams() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  return this.filteredExams.slice(startIndex, startIndex + this.itemsPerPage);
}

get totalPages(): number {
  return Math.ceil(this.filteredExams.length / this.itemsPerPage);
}
goToPage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
}

nextPage() {
  this.goToPage(this.currentPage + 1);
}

previousPage() {
  this.goToPage(this.currentPage - 1);
}

  
navigateToProfile(){
     this.router.navigate(['/profile'])
  }

  logout(){
    confirm("Çıkış yapmak istediğinze emin misiniz ?")
    this.authService.logout()
    this.router.navigate(['/login'])
  }
 onSearchChange() {
  const query = this.searchQuery.toLowerCase().trim();
  this.filteredExams = this.availableExams.filter(exam =>
    exam.title.toLowerCase().includes(query) ||
    exam.startTime.toLowerCase().includes(query) ||
    exam.duration.toString().includes(query)
  );
  this.currentPage = 1;
}


  startExam(examId: string) {
    this.router.navigate(['/take-exam', examId]);
  }
}
