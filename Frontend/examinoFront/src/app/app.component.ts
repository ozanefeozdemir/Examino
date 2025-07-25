import { Component, NgModule, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from "./pages/login/login.component";
import { HttpClient } from '@angular/common/http';
import { CommonModule, Location } from '@angular/common';
import { AuthService } from './service/auth/auth.service';
import { User } from './model/user.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'Examino';
  showNavbar = true
  currentUser!: User
  role: String | null = ''

  constructor(private location: Location, private router: Router, private authService: AuthService) {}
      

   ngOnInit() {

    this.role = this.authService.getUserRole()

    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        this.currentUser = res
      },
      error: (err) => {
        console.log("Kullanıcı alınamadı: ", err)
      }
    })
    
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;

        // Navbar ve footer'ı göstermemek istediğiniz sayfaların URL'lerini yazın
        const hideOnUrls = ['/take-exam', '/login', '/register'];

        // Eğer url bu listede varsa görünürlüğü kapat
        if (hideOnUrls.some(path => url.startsWith(path))) {
          this.showNavbar = false;
        } else {
          this.showNavbar = true;
        }
      }

    });
  }
  
  goBack() {
    this.location.back()
  }

  navigateToExams(){
    this.router.navigate(['/available-exams'])
  }

  navigateToMyExams() {
    this.router.navigate(['/my-exams']);
  }
  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToExamCreate() {
    this.router.navigate(['/exam-create']);
  }

  navigateToQuestionPool() {
    this.router.navigate(['/question-pool']);
  }

  navigateToResult() {
    this.router.navigate(['/results']);
  }

  navigateToAssign() {
    this.router.navigate(['/assign-exam']);
  }

  navigateToProfile() {
    this.router.navigate(['/profile']); // Eğer profil sayfan varsa
  }

  logout() {
    this.authService.logout()
  }

}