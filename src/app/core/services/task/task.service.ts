import { Tasks } from './../../interfaces/tasks';
import { Inject, inject, Injectable } from '@angular/core';
import { enviroment } from '../../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private API_URL = enviroment.API_URL;

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Tasks[]> {
    return this.http.get<Tasks[]>(`${this.API_URL}/tasks`)
  };

  createTask(task: Tasks): Observable<Tasks> {
    return this.http.post<Tasks>(`${this.API_URL}/tasks`, task);
  };

  deleteTask(task: Tasks): Observable<Tasks> {
    return this.http.delete<Tasks>(`${this.API_URL}/tasks/${task.id}`)
  };

}
