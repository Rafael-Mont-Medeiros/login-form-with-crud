import { inject, Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Users } from '../../interfaces/users';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = new BehaviorSubject<any>(this.getStoredUser());
  currentUser$ = this.currentUser.asObservable();
  private userService = inject(UserService);
  private router = inject(Router);
  private snakeBar = inject(MatSnackBar);



  private getStoredUser(): Users | null {
    try {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null
    } catch (err) {
      console.error('Erro ao ler locaStorage:', err);
      localStorage.removeItem('currentUser'); //limpeza de dados.
      return null;
    }
  }


  login(email: string, password: string): Observable<boolean> {
    // Limpeza de dados corrompidos
    if (!localStorage.getItem('currentUser')) {
      localStorage.removeItem('currentUser');
    }

    return this.userService.getUsers(email, password).pipe(
      tap(user => {
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUser.next(user);
          this.router.navigate(['/dashboard'])
        }else {
          //throw new Error('credenciais inválidas')
          this.snakeBar.open('Invalid email or password.', 'close', {
            duration: 3000,
          })
        }
      }),
      map((() => true)),
      catchError(() => of(false)) // Em caso de erro, retorna false
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser')
    this.currentUser.next(null);
    this.router.navigate(['/login']);
  };


  isAuthenticated(): boolean {
    return !!this.currentUser.value;
  };

}
