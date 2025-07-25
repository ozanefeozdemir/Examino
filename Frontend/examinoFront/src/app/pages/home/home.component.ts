import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { AuthService } from '../../service/auth/auth.service'
import { Router, RouterLink } from '@angular/router';
import { User } from '../../model/user.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser?: User
  name?: string[]
  firstName?: string
  lastName?: string

  constructor(private authService: AuthService,private router: Router, private location: Location) {}

  goBack(){
    this.location.back()
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user: User) => {
        console.log("current: "+this.authService.getCurrentUser())
        this.currentUser = user
        this.name = user.fullName.split(' ')
        this.firstName = this.name[0]
        this.lastName = this.name.pop()
        console.log("Gelen User: ", this.currentUser)
      },
      error: (err) => {
          console.log("Kullanıcı alınamadı", err)
      }
    })
  }

  navigateToProfile(){
     this.router.navigate(['/profile'])
  }

  logout(){
    confirm("Çıkış yapmak istediğinze emin misiniz ?")
    this.authService.logout()
    this.router.navigate(['/login'])
  }
}
