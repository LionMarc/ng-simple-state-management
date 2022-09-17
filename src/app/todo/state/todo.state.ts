import update, { Spec } from 'immutability-helper';

import { NgSsmFeatureState, State } from 'ngssm-store';

export const selectTodoState = (state: State): TodoState =>
    state[TodoStateSpecification.featureStateKey] as TodoState;

export const updateTodoState = (state: State, command: Spec<TodoState, never>): State =>
  update(state, {
    [TodoStateSpecification.featureStateKey]: command
  });

export interface TodoState {}

@NgSsmFeatureState({
  featureStateKey: TodoStateSpecification.featureStateKey,
  initialState: TodoStateSpecification.initialState
})
export class TodoStateSpecification {
  public static readonly featureStateKey = 'todo-state';
  public static readonly initialState: TodoState = {};
}
