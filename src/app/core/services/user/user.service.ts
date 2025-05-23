
import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
import { enviroment } from '../../../enviroments/enviroment';
import { map, Observable } from 'rxjs';
import { Users } from '../../interfaces/users';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private API_URL = enviroment.API_URL;
  private apiUrl = 'http://localhost:3000';


  getUsers(email: string, password: string): Observable<Users | null> {
    return this.http.get<Users[]>(`${this.apiUrl}/users?email=${email}`).pipe(
      map((users) => {
        const user = users.find(u => u.password === password);
        return user || null; // Retorna o usuário se a senha bater, senão retorna null
      })
    );
  };

  createUser(user: Users): Observable<Users> {
    return this.http.post<Users>(`${this.apiUrl}/users`, user);
  }


}
