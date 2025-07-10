import { Component, inject, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { Tasks } from '../../core/interfaces/tasks';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-task-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    FormsModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './edit-task-dialog.component.html',
  styleUrl: './edit-task-dialog.component.scss'
})
export class EditTaskDialogComponent {
  private snake = inject(MatSnackBar);

  constructor(
    public dialogRef: MatDialogRef<EditTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: Tasks }
  ) {};

  onCancel(): void {
    this.dialogRef.close();
    this.snake.open('Edição cancelada', 'fechar', {
      duration: 3000,
    });
  };

  onSave(): void {
    this.dialogRef.close(this.data.task);
    this.snake.open('Tarefa editada com sucesso', 'fechar', {
      duration: 3000,
    });

  };
}

