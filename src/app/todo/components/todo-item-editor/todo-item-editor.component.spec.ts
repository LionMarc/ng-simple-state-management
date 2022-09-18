import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoItemEditorComponent } from './todo-item-editor.component';

describe('TodoItemEditorComponent', () => {
  let component: TodoItemEditorComponent;
  let fixture: ComponentFixture<TodoItemEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoItemEditorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoItemEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
