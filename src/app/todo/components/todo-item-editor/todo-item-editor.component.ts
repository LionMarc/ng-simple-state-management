import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { take, takeUntil } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';
import { selectNgssmDataSourceValue } from 'ngssm-data';

import { selectTodoState } from '../../state';
import { TodoActionType, UpdateTodoItemPropertyAction } from '../../actions';
import { TodoItem, todoItemKey } from '../../model';

@Component({
  selector: 'app-todo-item-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './todo-item-editor.component.html',
  styleUrls: ['./todo-item-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemEditorComponent extends NgSsmComponent {
  public readonly dialogTitle = signal<string>('');
  public readonly submitLabel = signal<string>('Create to-do');
  public readonly titleControl = new FormControl<string | null>(null, Validators.required);
  public readonly submittingTodo = signal<boolean>(false);

  constructor(store: Store) {
    super(store);

    this.watch((s) => selectTodoState(s).todoItemEditor.todoItemId)
      .pipe(take(1))
      .subscribe((value) => {
        if (value !== undefined) {
          this.dialogTitle.set(`To-Do edition`);
          this.submitLabel.set('Update To-Do');
        } else {
          this.dialogTitle.set(`To-Do creation`);
          this.submitLabel.set('Create To-Do');
        }
      });

    this.watch((s) => selectNgssmDataSourceValue(s, todoItemKey)?.value).subscribe((value: TodoItem) => {
      if (value?.title) {
        this.titleControl.setValue(value.title);
      }
    });

    this.titleControl.valueChanges.pipe(takeUntil(this.unsubscribeAll$)).subscribe((value) => {
      this.dispatchAction(new UpdateTodoItemPropertyAction('title', value));
    });

    this.watch((s) => selectTodoState(s).todoItemEditor.submissionInProgress).subscribe((value) => {
      if (value) {
        this.titleControl.disable();
      } else {
        this.titleControl.enable();
      }
    });

    this.watch((s) => selectTodoState(s).todoItemEditor.submissionInProgress).subscribe((v) => this.submittingTodo.set(v));
  }

  public closeEditor(): void {
    this.dispatchActionType(TodoActionType.closeTodoItemEditor);
  }

  public submit(): void {
    this.dispatchActionType(TodoActionType.submitEditedTodoItem);
  }
}
