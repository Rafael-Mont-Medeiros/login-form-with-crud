
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';

import { enviroment } from '../../../enviroments/enviroment';
import { Users } from '../../interfaces/users';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private API_URL = enviroment.API_URL;
  private snakeBar = inject(MatSnackBar)

  getUsers(email: string, password: string): Observable<Users | null> {
    return this.http.get<Users[]>(`${this.API_URL}/users?email=${email}`).pipe(
      map((users) => {
        const user = users.find(u => u.password === password);
        return user || null; // Retorna o usuário se a senha bater, senão retorna null
      })
    );
  };

  checkEmailExist(email: string): Observable<boolean> {
    return this.http.get<any[]>(`${this.API_URL}/users?email${email}`)
      .pipe(
        map(users => users.length > 0)
      )
  };

  createUser(user: Users): Observable<Users> {
    return this.checkEmailExist(user.email).pipe(
      switchMap((emailExists) => {
        if (emailExists) {
          return throwError(() => ({
            error: { message: 'Email já está em uso!' }
          }));
        } else {
          return this.http.post<Users>(`${this.API_URL}/users`, user);
        }
      }),
      catchError((error) => throwError(() => error)) // Repassa erros de HTTP
    );

  }
}
