import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth/auth.service';
import { User } from '../../model/user.model';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../service/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user!: User;
  userEdit: any = {};
  showModal: boolean = false;

  constructor(private authService: AuthService, private userService: UserService, private location: Location) { }
  goBack() {
    this.location.back()
  }
  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (u) => {
        this.user = u;
        this.userEdit = { ...u }; // Modal için kopyasını al
      },
      error: () => console.error('Kullanıcı bilgisi alınamadı.')
    });
  }

  openEditModal() {
    this.userEdit = { ...this.user };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveProfile() {

    this.userService.updateUser(this.user?.id, this.userEdit).subscribe({
      next: (res) => {
        console.log(res)
        this.user = res
      },
      error: (err) => {
        console.log("Kullanıcı güncellenemedi", err)
      }
    })
    this.userEdit = { ...this.user };

    this.showModal = false;
  }
}
