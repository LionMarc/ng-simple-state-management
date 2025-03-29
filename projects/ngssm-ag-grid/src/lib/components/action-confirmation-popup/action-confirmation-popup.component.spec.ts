import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionConfirmationPopupComponent } from './action-confirmation-popup.component';

describe('ActionConfirmationPopupComponent', () => {
  let component: ActionConfirmationPopupComponent;
  let fixture: ComponentFixture<ActionConfirmationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionConfirmationPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionConfirmationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
