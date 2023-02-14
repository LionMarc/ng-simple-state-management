import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, take, takeUntil } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';

import { selectTodoState } from '../../state';
import { TodoActionType, UpdateTodoItemPropertyAction } from '../../actions';
import { selectRemoteData } from 'ngssm-remote-data';
import { TodoItem, todoItemKey } from '../../model';

@Component({
  selector: 'app-todo-item-editor',
  templateUrl: './todo-item-editor.component.html',
  styleUrls: ['./todo-item-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemEditorComponent extends NgSsmComponent {
  private readonly _dialogTitle$ = new BehaviorSubject<string>('');
  private readonly _submitLabel$ = new BehaviorSubject<string>('Create to-do');

  public readonly titleControl = new FormControl<string | null>(null, Validators.required);

  constructor(store: Store) {
    super(store);

    this.watch((s) => selectTodoState(s).todoItemEditor.todoItemId)
      .pipe(take(1))
      .subscribe((value) => {
        if (value !== undefined) {
          this._dialogTitle$.next(`To-Do edition`);
          this._submitLabel$.next('Update To-Do');
        } else {
          this._dialogTitle$.next(`To-Do creation`);
          this._submitLabel$.next('Create To-Do');
        }
      });

    this.watch((s) => selectRemoteData(s, todoItemKey).data).subscribe((value: TodoItem) => {
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
  }

  public get dialogTitle$(): Observable<string> {
    return this._dialogTitle$.asObservable();
  }

  public get submittingTodo$(): Observable<boolean> {
    return this.watch((s) => selectTodoState(s).todoItemEditor.submissionInProgress);
  }

  public get submitLabel$(): Observable<string> {
    return this._submitLabel$.asObservable();
  }

  public closeEditor(): void {
    this.dispatchActionType(TodoActionType.closeTodoItemEditor);
  }

  public submit(): void {
    this.dispatchActionType(TodoActionType.submitEditedTodoItem);
  }
}
