import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  private authService = inject(AuthService)
  private snakeBar = inject(MatSnackBar)

  onClose():void {
    this.authService.logout()
    this.snakeBar.open('successfully logged out', 'close', {
      duration: 3000,
    })
  }

}
