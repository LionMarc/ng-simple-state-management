import { Component, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgssmComponentOverlayDirective } from './ngssm-component-overlay.directive';

@Component({
  template: ` <div [ngssmDisplayOverlay]="overlayRendered()">custom content</div> `,
  imports: [NgssmComponentOverlayDirective]
})
class TestingComponent {
  public readonly overlayRendered = signal(false);
}

@Component({
  selector: 'ngssm-component-to-render',
  template: ` Something `,
  imports: []
})
class ComponentToRender {}

@Component({
  template: ` <div [ngssmDisplayOverlay]="overlayRendered()" [overlayComponent]="component">custom content</div> `,
  imports: [NgssmComponentOverlayDirective]
})
class WithAComponent {
  public readonly overlayRendered = signal(false);
  protected readonly component = ComponentToRender;
}

@Component({
  template: `
    <div [ngssmDisplayOverlay]="overlayRendered()" [overlayTemplate]="toRender">custom content</div>

    <ng-template #toRender> <span id="message">Hello from template</span> </ng-template>
  `,
  imports: [NgssmComponentOverlayDirective]
})
class WithATemplate {
  public readonly overlayRendered = signal(false);
}

describe('NgssmComponentOverlayDirective', () => {
  describe(`no component or template set as input`, () => {
    let fixture: ComponentFixture<TestingComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestingComponent],
        providers: [],
        teardown: { destroyAfterEach: true }
      });

      fixture = TestBed.createComponent(TestingComponent);
      fixture.nativeElement.style['min-height'] = '200px';
      fixture.nativeElement.style['min-width'] = '400px';
      fixture.detectChanges();
    });

    it(`should render the overlay when value is true`, () => {
      fixture.componentInstance.overlayRendered.set(true);
      fixture.detectChanges();

      const overlay = fixture.debugElement.query(By.css('ngssm-message-overlay'));
      expect(overlay).toBeTruthy();
    });
  });

  describe(`render a component`, () => {
    let fixture: ComponentFixture<WithAComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [WithAComponent],
        providers: [],
        teardown: { destroyAfterEach: true }
      });

      fixture = TestBed.createComponent(WithAComponent);
      fixture.nativeElement.style['min-height'] = '600px';
      fixture.nativeElement.style['min-width'] = '400px';
      fixture.detectChanges();
    });

    it(`should render the overlay when value is true`, () => {
      fixture.componentInstance.overlayRendered.set(true);
      fixture.detectChanges();

      const overlay = fixture.debugElement.query(By.css('ngssm-component-to-render'));
      expect(overlay).toBeTruthy();
    });
  });

  describe(`render a tempalte`, () => {
    let fixture: ComponentFixture<WithATemplate>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [WithATemplate],
        providers: [],
        teardown: { destroyAfterEach: true }
      });

      fixture = TestBed.createComponent(WithATemplate);
      fixture.nativeElement.style['min-height'] = '600px';
      fixture.nativeElement.style['min-width'] = '400px';
      fixture.detectChanges();
    });

    it(`should render the overlay when value is true`, () => {
      fixture.componentInstance.overlayRendered.set(true);
      fixture.detectChanges();

      const overlay = fixture.debugElement.query(By.css('#message'));
      expect(overlay).toBeTruthy();
    });
  });
});
