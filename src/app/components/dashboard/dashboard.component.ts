import { Users } from './../../core/interfaces/users';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../material.module';
import { MatDialog } from '@angular/material/dialog';
import { TodoFormComponent } from '../todo-form/todo-form.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  private authService = inject(AuthService)
  private snakeBar = inject(MatSnackBar)
  private matDialog = inject(MatDialog)
  currentUser : Users| null = null


  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user =>{
      this.currentUser = user
    })
  }

  onNewTask(){
    this.matDialog.open(TodoFormComponent, {
      width: '400px',
      height: '400px'
    })
  }

  onClose(): void {
    this.authService.logout()
    this.snakeBar.open('successfully logged out', 'close', {
      duration: 3000,
    })
  }

}
