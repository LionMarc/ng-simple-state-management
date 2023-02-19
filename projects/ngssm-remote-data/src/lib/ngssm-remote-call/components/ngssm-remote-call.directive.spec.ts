import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Store, StoreMock } from 'ngssm-store';

import { NgssmRemoteCallStateSpecification } from '../state';
import { NgssmRemoteCallDirective } from './ngssm-remote-call.directive';

@Component({
  standalone: true,
  template: ` <div [ngssmRemoteCall]="'demo'">custom content</div> `,
  imports: [CommonModule, NgssmRemoteCallDirective]
})
class TestingComponent {}

describe('NgssmRemoteCallDirective', () => {
  let component: TestingComponent;
  let fixture: ComponentFixture<TestingComponent>;
  let store: StoreMock;
  let directive: NgssmRemoteCallDirective;

  beforeEach(async () => {
    store = new StoreMock({
      [NgssmRemoteCallStateSpecification.featureStateKey]: NgssmRemoteCallStateSpecification.initialState
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
      .query(By.directive(NgssmRemoteCallDirective))
      .injector.get(NgssmRemoteCallDirective) as NgssmRemoteCallDirective;
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
