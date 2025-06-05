import { error } from 'console';
import { AuthService } from './../../core/services/auth/auth.service';
import { UserService } from './../../core/services/user/user.service';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService)
  toggleForm = true


  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  onSubmitLogin(): void {
    if (this.loginForm.invalid) {
      this.snackBar.open('Formulário inválido', 'Fechar', { duration: 3000 });
      return;
    }
    const { email, password } = this.loginForm.value;
    this.authService.login(email!, password!).subscribe({
      error: () => {
        this.snackBar.open(' invalid credentials.', 'close.', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.loginForm.reset();
      }
    })
  };

  onSubmitRegister(): void {
    if (this.registerForm.invalid) {
      this.snackBar.open('invalid fields', 'close', {
        duration: 3000,
      })
    }

    const { name, email, password } = this.registerForm.value;

    this.authService.register({
      name: name!,
      email: email!,
      password: password!,
    }).subscribe({
      next: () => {
        this.snackBar.open('user created successfully', 'close', {
          duration: 3000,
        })
      },
      error: (err) => {
        this.snackBar.open( err.error?.message ||'error in registration', 'close', {
          duration: 3000,
        })
      }
    })

  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard'])
    }
  }

}
