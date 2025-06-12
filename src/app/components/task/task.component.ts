import { CommonModule } from '@angular/common';
import { Tasks } from '../../core/interfaces/tasks';
import { TaskService } from './../../core/services/task/task.service';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent implements OnInit {
  private matDialog = inject(MatDialog)

  tasks: Tasks[] = []


  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((data) => {
      this.tasks = data;
    })
  };

  onNewTask() {
    const dialogRef =this.matDialog.open(TodoFormComponent, {
      width: '400px',
      height: '400px'
    })

    dialogRef.afterClosed().subscribe((createdTask: Tasks)=>{
      if(createdTask){
        this.tasks.push(createdTask)
      }
    })
  };





  deleteTask(tasks: Tasks){
    this.taskService.deleteTask(tasks).subscribe(
      ()=> this.tasks = this.tasks.filter (t => t.id !== tasks.id)
    )
  }
};
