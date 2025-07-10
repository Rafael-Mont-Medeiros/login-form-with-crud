
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Tasks } from '../../core/interfaces/tasks';
import { TaskService } from '../../core/services/task/task.service';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
  ],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.scss'
})
export class TodoFormComponent {

  private taskService = inject(TaskService);
  private matDialogRef = inject(MatDialogRef);
  private snackBar = inject(MatSnackBar);


  public todoForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(4)]),
    description: new FormControl('', [Validators.required, Validators.minLength(4)]),
  })

  addTask(): void {
    if (this.todoForm.valid) {
      const newTask: Tasks = {
        ...this.todoForm.value as { id: number, title: string, description: string, },
        completed: false
      }

      this.taskService.createTask(newTask).subscribe({
        next: (createdTask) => {
          this.matDialogRef.close(createdTask);
        },
        complete: () => {
          this.snackBar.open('Tarefa criada com sucesso', 'fechar', {
            duration: 3000,
          })
        },
        error: (err) => {
          console.error('Erro ao criar tarefa', err)
        }
      })
    } else {
      this.snackBar.open('preencha os campos com requisitos minimos', 'fechar', {
        duration: 3000,
      })
    }
  };

  closeDialog(){
    this.matDialogRef.close();
  }

}
