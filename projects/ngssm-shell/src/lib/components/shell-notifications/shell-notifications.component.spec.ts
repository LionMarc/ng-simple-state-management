import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialImportsModule } from 'ngssm-toolkit';

import { ShellNotificationsComponent } from './shell-notifications.component';

describe('ShellNotificationsComponent', () => {
  let component: ShellNotificationsComponent;
  let fixture: ComponentFixture<ShellNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShellNotificationsComponent],
      imports: [MaterialImportsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ShellNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
