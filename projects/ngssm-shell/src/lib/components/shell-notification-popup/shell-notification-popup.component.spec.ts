import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellNotificationPopupComponent } from './shell-notification-popup.component';

describe('ShellNotificationPopupComponent', () => {
  let component: ShellNotificationPopupComponent;
  let fixture: ComponentFixture<ShellNotificationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellNotificationPopupComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ShellNotificationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
