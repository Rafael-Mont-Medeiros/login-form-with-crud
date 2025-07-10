import { CommonModule } from '@angular/common';
import { Tasks } from '../../core/interfaces/tasks';
import { TaskService } from './../../core/services/task/task.service';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';
import { PageEvent } from '@angular/material/paginator';
import { EditTaskDialogComponent } from '../edit-task-dialog/edit-task-dialog.component';

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

  tasks: Tasks[] = [];
  totalItems = 0;
  pageSize = 5;
  currentPage = 0;


  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks()
  };

  loadTasks() {
    const apiPage = this.currentPage + 1
    this.taskService.getTasks(apiPage, this.pageSize).subscribe(data => {
      this.tasks = data.tasks;
      this.totalItems = data.total;
    })
  };

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadTasks();
  }

  onNewTask() {
    const dialogRef = this.matDialog.open(TodoFormComponent, {
      width: '400px',
      height: '400px'
    })

    dialogRef.afterClosed().subscribe((createdTask: Tasks) => {
      if (createdTask) {
        /* this.tasks.push(createdTask) */
        this.loadTasks()
      }
    })
  };

  deleteTask(tasks: Tasks) {
    this.taskService.deleteTask(tasks).subscribe(() => {
      this.loadTasks();
    });
    /* ()=> this.tasks = this.tasks.filter (t => t.id !== tasks.id) */
  }

  editTask(task:Tasks): void {
    const dialogRef = this.matDialog.open(EditTaskDialogComponent, {
      width: '400px',
      height: '400px',
      data: { task: {...task} } // Pass a copy of the task
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result){
        this.taskService.updateTask(result).subscribe(() => {
          this.loadTasks();
        }
      );
      }
    })
};

}
