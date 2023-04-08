import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellNotificationComponent } from './shell-notification.component';

describe('ShellNotificationComponent', () => {
  let component: ShellNotificationComponent;
  let fixture: ComponentFixture<ShellNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellNotificationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ShellNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
