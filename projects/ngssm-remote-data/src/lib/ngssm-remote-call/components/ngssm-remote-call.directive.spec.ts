import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { StoreMock } from 'ngssm-store/testing';
import { Store } from 'ngssm-store';

import { NgssmRemoteCallStateSpecification, updateNgssmRemoteCallState } from '../state';
import { NgssmRemoteCallDirective } from './ngssm-remote-call.directive';
import { RemoteCallStatus } from '../model';

@Component({
  template: ` <div [ngssmRemoteCall]="'demo'">custom content</div> `,
  imports: [CommonModule, NgssmRemoteCallDirective]
})
class TestingComponent {}

describe('NgssmRemoteCallDirective', () => {
  let fixture: ComponentFixture<TestingComponent>;
  let store: StoreMock;
  let directive: NgssmRemoteCallDirective;

  beforeEach(() => {
    store = new StoreMock({
      [NgssmRemoteCallStateSpecification.featureStateKey]: NgssmRemoteCallStateSpecification.initialState
    });
    TestBed.configureTestingModule({
      imports: [TestingComponent],
      providers: [{ provide: Store, useValue: store }],
      teardown: { destroyAfterEach: true }
    });

    fixture = TestBed.createComponent(TestingComponent);
    fixture.nativeElement.style['min-height'] = '200px';
    fixture.detectChanges();
    directive = fixture.debugElement
      .query(By.directive(NgssmRemoteCallDirective))
      .injector.get(NgssmRemoteCallDirective) as NgssmRemoteCallDirective;
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it(`should not render the overlay when remote call is not defined`, () => {
    const overlay = fixture.debugElement.query(By.css('ngssm-message-overlay'));
    expect(overlay).toBeFalsy();
  });

  describe(`when remoteCallId is set in state`, () => {
    const statuses: RemoteCallStatus[] = [RemoteCallStatus.done, RemoteCallStatus.ko, RemoteCallStatus.none];
    statuses.forEach((status) => {
      it(`should not render the overlay when remote call status is ${status}`, () => {
        const state = updateNgssmRemoteCallState(store.stateValue, {
          remoteCalls: {
            demo: {
              $set: {
                status: status
              }
            }
          }
        });
        store.stateValue = state;
        fixture.detectChanges();

        const overlay = fixture.debugElement.query(By.css('ngssm-message-overlay'));
        expect(overlay).toBeFalsy();
      });
    });

    it(`should render the overlay when remote call status is ${RemoteCallStatus.inProgress}`, () => {
      const state = updateNgssmRemoteCallState(store.stateValue, {
        remoteCalls: {
          demo: {
            $set: {
              status: RemoteCallStatus.inProgress
            }
          }
        }
      });
      store.stateValue = state;
      fixture.detectChanges();

      const overlay = fixture.debugElement.query(By.css('ngssm-message-overlay'));
      expect(overlay).toBeTruthy();
    });
  });
});
