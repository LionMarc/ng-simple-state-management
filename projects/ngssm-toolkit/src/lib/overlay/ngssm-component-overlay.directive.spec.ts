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

describe('NgssmComponentOverlayDirective', () => {
  let fixture: ComponentFixture<TestingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingComponent],
      providers: [],
      teardown: { destroyAfterEach: false }
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
