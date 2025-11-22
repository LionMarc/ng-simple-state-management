import { Component, ChangeDetectionStrategy, signal, effect, inject } from '@angular/core';

import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { createSignal, Store } from 'ngssm-store';
import { dataSourceToSignal } from 'ngssm-data';

import { selectTodoState } from '../../state';
import { TodoActionType, UpdateTodoItemPropertyAction } from '../../actions';
import { TodoItem, todoItemKey } from '../../model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ngssm-todo-item-editor',
  imports: [
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
export class TodoItemEditorComponent {
  private readonly store = inject(Store);

  private readonly todoItem = dataSourceToSignal<TodoItem | undefined>(todoItemKey);

  public readonly dialogTitle = signal<string>('');
  public readonly submitLabel = signal<string>('Create to-do');
  public readonly titleControl = new FormControl<string | null>(null, Validators.required);
  public readonly submittingTodo = createSignal<boolean>((state) => selectTodoState(state).todoItemEditor.submissionInProgress);

  constructor() {
    const todoItemId = selectTodoState(this.store.state()).todoItemEditor.todoItemId;
    if (todoItemId !== undefined) {
      this.dialogTitle.set(`To-Do edition`);
      this.submitLabel.set('Update To-Do');
    } else {
      this.dialogTitle.set(`To-Do creation`);
      this.submitLabel.set('Create To-Do');
    }

    effect(() => {
      const value = this.todoItem.value();
      if (value?.title) {
        this.titleControl.setValue(value.title);
      }
    });

    this.titleControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.store.dispatchAction(new UpdateTodoItemPropertyAction('title', value));
    });

    effect(() => {
      if (this.submittingTodo()) {
        this.titleControl.disable();
      } else {
        this.titleControl.enable();
      }
    });
  }

  public closeEditor(): void {
    this.store.dispatchActionType(TodoActionType.closeTodoItemEditor);
  }

  public submit(): void {
    this.store.dispatchActionType(TodoActionType.submitEditedTodoItem);
  }
}
