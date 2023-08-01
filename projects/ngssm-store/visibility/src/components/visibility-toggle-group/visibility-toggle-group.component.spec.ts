import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibilityToggleGroupComponent } from './visibility-toggle-group.component';

describe('VisibilityToggleGroupComponent', () => {
  let component: VisibilityToggleGroupComponent;
  let fixture: ComponentFixture<VisibilityToggleGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VisibilityToggleGroupComponent]
    });
    fixture = TestBed.createComponent(VisibilityToggleGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
