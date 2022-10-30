import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockComponent } from 'ng-mocks';

import { ShellNotificationComponent } from '../shell-notification/shell-notification.component';
import { ShellNotificationPopupComponent } from './shell-notification-popup.component';

describe('ShellNotificationPopupComponent', () => {
  let component: ShellNotificationPopupComponent;
  let fixture: ComponentFixture<ShellNotificationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShellNotificationPopupComponent, MockComponent(ShellNotificationComponent)]
    }).compileComponents();

    fixture = TestBed.createComponent(ShellNotificationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
