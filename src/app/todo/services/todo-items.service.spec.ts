import { TestBed } from '@angular/core/testing';

import { TodoItemsService } from './todo-items.service';

describe('TodoItemsService', () => {
  let service: TodoItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
