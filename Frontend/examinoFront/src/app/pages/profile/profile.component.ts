import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth/auth.service';
import { User } from '../../model/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user?: User;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (u) => this.user = u,
      error: () => console.error('Kullanıcı bilgisi alınamadı.')
    });
  }

  editProfile() {
    // Daha sonra profil düzenleme ekranına yönlendirebilirsin
    alert('Profili düzenleme yakında!');
  }
}
