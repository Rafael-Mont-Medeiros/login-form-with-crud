import { Tasks } from './../../interfaces/tasks';
import { Inject, inject, Injectable } from '@angular/core';
import { enviroment } from '../../../enviroments/enviroment';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private API_URL = enviroment.API_URL;

  constructor(private http: HttpClient) { }

  getTasks(page: number, limit: number): Observable<{ tasks: Tasks[], total: number }> {
    const params = new HttpParams()
      .set('_page', page.toString())
      .set('_limit', limit.toString());

    /* return this.http.get<Tasks[]>(`${this.API_URL}/tasks`) */

    return this.http.get<Tasks[]>(`${this.API_URL}/tasks`, { params, observe: 'response' }).pipe(
      map((response: HttpResponse<Tasks[]>) => {
        const total = Number(response.headers.get('X-Total-Count'));
        return { tasks: response.body || [], total };
      })
    );
  };

  createTask(task: Tasks): Observable<Tasks> {
    return this.http.post<Tasks>(`${this.API_URL}/tasks`, task);
  };

  deleteTask(task: Tasks): Observable<Tasks> {
    return this.http.delete<Tasks>(`${this.API_URL}/tasks/${task.id}`)
  };

  updateTask(task: Tasks): Observable<Tasks> {
    return this.http.put<Tasks>(`${this.API_URL}/tasks/${task.id}`, task);
  };

}
