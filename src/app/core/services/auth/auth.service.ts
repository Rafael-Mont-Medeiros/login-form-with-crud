import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';


import { MatSnackBar } from '@angular/material/snack-bar';

import { UserService } from '../user/user.service';
import { Users } from '../../interfaces/users';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = new BehaviorSubject<any>(this.getStoredUser());
  private userService = inject(UserService);
  private router = inject(Router);
  private snakeBar = inject(MatSnackBar);
  currentUser$ = this.currentUser.asObservable();
  private _isAuthenticated = new BehaviorSubject<boolean | null>(null);
  isAuthenticated$ = this._isAuthenticated.asObservable();
  private currentUserName = new BehaviorSubject <Users | null>(null)

  constructor(){
    this.checkAuthState()
    this.loadInitialUser()
  }

    private loadInitialUser(): void {
    const user = this.getStoredUser();
    this.currentUserName.next(user);
  }

  private checkAuthState(): void {
    const user = this.getStoredUser();
    this._isAuthenticated.next(!!user);
  }


  private getStoredUser(): Users | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null
      } return null;
    } catch (err) {
      console.error('Erro ao ler locaStorage:', err);
      localStorage.removeItem('currentUser'); //limpeza de dados.
      return null;
    }
  }


  login(email: string, password: string,): Observable<boolean> {
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
          this.snakeBar.open('logged in successfully', 'close', {
            duration: 3000,
          })
        } else {
          this.snakeBar.open('Invalid email or password.', 'close', {
            duration: 3000,
          })
        }
      }),
      map((() => true)),
      catchError(() => of(false)) // Em caso de erro, retorna false
    )
  };

  register(userDatas: { name: string, email: string, password: string }): Observable<Users> {
    return this.userService.createUser({
      name: userDatas.name,
      email: userDatas.email,
      password: userDatas.password,
    }).pipe(
      tap(newUser => {
        localStorage.setItem('currentUser', JSON.stringify(newUser))
        this.currentUser.next(newUser)
      })
    )
  };

  logout(): void {
    localStorage.removeItem('currentUser')
    this.currentUser.next(null);
    this.router.navigate(['/login']);
  };


  isAuthenticated(): boolean {
    return !!this.currentUser.value;
  };



}
