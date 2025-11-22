import { By } from '@angular/platform-browser';
import { Component, signal, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgssmComponentAction, NgssmComponentDisplayDirective } from './ngssm-component-display.directive';

@Component({
  selector: 'ngssm-first',
  template: `{{ title }}`,
  imports: []
})
class FirstComponent {
  public title = 'First';
}

@Component({
  selector: 'ngssm-second',
  template: `{{ title }}`,
  imports: []
})
class SecondComponent {
  public title = 'Second';
}

@Component({
  template: ` <div [ngssmComponentDisplay]="componentToDisplay()" [ngssmComponentAction]="componentAction()"></div> `,
  imports: [NgssmComponentDisplayDirective]
})
class TestingComponent {
  public readonly componentToDisplay = signal<Type<unknown>>(FirstComponent);
  public readonly componentAction = signal<NgssmComponentAction | null>(null);
}

describe('NgssmComponentDisplayDirective', () => {
  let component: TestingComponent;
  let fixture: ComponentFixture<TestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingComponent],
      teardown: { destroyAfterEach: true }
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
    component.componentToDisplay.set(SecondComponent);

    fixture.detectChanges();
    await fixture.whenStable();

    const element = fixture.debugElement.query(By.css('ngssm-second'));

    expect(element).toBeTruthy();
  });

  it('should render the new title when component action is updated', async () => {
    component.componentAction.set((component) => ((component as FirstComponent).title = 'New Title'));

    fixture.detectChanges();
    await fixture.whenStable();

    const element = fixture.debugElement.query(By.css('ngssm-first'));

    expect(element.nativeElement.innerHTML).toContain('New Title');
  });
});
