import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';

import { NgssmNotificationErrorComponent } from './ngssm-notification-error.component';

describe('NgssmNotificationErrorComponent', () => {
  let component: NgssmNotificationErrorComponent;
  let fixture: ComponentFixture<NgssmNotificationErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgssmNotificationErrorComponent],
      providers: [{ provide: MAT_SNACK_BAR_DATA, useValue: 'Error message' }],
      teardown: { destroyAfterEach: false }
    }).compileComponents();

    fixture = TestBed.createComponent(NgssmNotificationErrorComponent);
    component = fixture.componentInstance;
    fixture.nativeElement.style['min-height'] = '200px';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the error message', () => {
    const message = fixture.debugElement.query(By.css('.ngssm-notification-error-message')).nativeElement;

    expect(message.innerHTML).toContain('Error message');
  });

  it('should render the warning icon', () => {
    const icon = fixture.debugElement.query(By.css('.fa-triangle-exclamation'));

    expect(icon).toBeTruthy();
  });
});
