import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';

import { NgssmNotificationSuccessComponent } from './ngssm-notification-success.component';

describe('NgssmNotificationSuccessComponent', () => {
  let component: NgssmNotificationSuccessComponent;
  let fixture: ComponentFixture<NgssmNotificationSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgssmNotificationSuccessComponent],
      providers: [{ provide: MAT_SNACK_BAR_DATA, useValue: 'Success message' }],
      teardown: { destroyAfterEach: false }
    }).compileComponents();

    fixture = TestBed.createComponent(NgssmNotificationSuccessComponent);
    component = fixture.componentInstance;
    fixture.nativeElement.style['min-height'] = '200px';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the success message', () => {
    const message = fixture.debugElement.query(By.css('.ngssm-notification-success-message')).nativeElement;

    expect(message.innerHTML).toContain('Success message');
  });

  it('should render the check icon', () => {
    const icon = fixture.debugElement.query(By.css('.fa-check'));

    expect(icon).toBeTruthy();
  });
});
