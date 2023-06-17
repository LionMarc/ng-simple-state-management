import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

import { RemoteDataStateSpecification } from '../state';
import { NgssmRemoteDataOverlayDirective } from './ngssm-remote-data-overlay.directive';

@Component({
  standalone: true,
  template: ` <div [ngssmRemoteDataOverlay]="['key1', 'key2']">custom content</div> `,
  imports: [CommonModule, NgssmRemoteDataOverlayDirective]
})
class TestingComponent {}

describe('NgssmRemoteDataOverlayDirective', () => {
  let component: TestingComponent;
  let fixture: ComponentFixture<TestingComponent>;
  let store: StoreMock;
  let directive: NgssmRemoteDataOverlayDirective;

  beforeEach(async () => {
    store = new StoreMock({
      [RemoteDataStateSpecification.featureStateKey]: RemoteDataStateSpecification.initialState
    });
    await TestBed.configureTestingModule({
      imports: [TestingComponent],
      providers: [{ provide: Store, useValue: store }],
      teardown: { destroyAfterEach: false }
    }).compileComponents();

    fixture = TestBed.createComponent(TestingComponent);
    component = fixture.componentInstance;
    fixture.nativeElement.style['min-height'] = '200px';
    fixture.detectChanges();
    directive = fixture.debugElement
      .query(By.directive(NgssmRemoteDataOverlayDirective))
      .injector.get(NgssmRemoteDataOverlayDirective) as NgssmRemoteDataOverlayDirective;
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
