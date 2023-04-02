import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

import { NgssmComponentDisplayDirective } from './ngssm-component-display.directive';

@Component({
  standalone: true,
  selector: 'ngssm-first',
  template: `First`,
  imports: [CommonModule]
})
class FirstComponent {}

@Component({
  standalone: true,
  selector: 'ngssm-second',
  template: `Second`,
  imports: [CommonModule]
})
class SecondComponent {}

@Component({
  standalone: true,
  template: ` <div [ngssmComponentDisplay]="componentToDisplay$ | async"></div> `,
  imports: [CommonModule, NgssmComponentDisplayDirective]
})
class TestingComponent {
  public readonly componentToDisplay$ = new BehaviorSubject<any>(FirstComponent);
}

describe('NgssmComponentDisplayDirective', () => {
  let component: TestingComponent;
  let fixture: ComponentFixture<TestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingComponent],
      teardown: { destroyAfterEach: false }
    }).compileComponents();

    fixture = TestBed.createComponent(TestingComponent);
    component = fixture.componentInstance;
    fixture.nativeElement.style['min-height'] = '200px';
    fixture.detectChanges();
  });

  it('should render the FirstComponent', () => {
    const element = fixture.debugElement.query(By.css('ngssm-first'));

    expect(element).toBeTruthy();
  });

  it('should render the SecondComponent when updating the component to display', async () => {
    component.componentToDisplay$.next(SecondComponent);

    fixture.detectChanges();
    await fixture.whenStable();

    const element = fixture.debugElement.query(By.css('ngssm-second'));

    expect(element).toBeTruthy();
  });
});
