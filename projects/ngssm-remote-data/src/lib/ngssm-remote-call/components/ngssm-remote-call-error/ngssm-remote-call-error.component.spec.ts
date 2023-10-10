import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { By } from '@angular/platform-browser';
import { JsonPipe } from '@angular/common';

import { Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

import { NgssmRemoteCallErrorComponent } from './ngssm-remote-call-error.component';
import { NgssmRemoteCallStateSpecification, updateNgssmRemoteCallState } from '../../state';
import { RemoteCallStatus } from '../../model';

describe('NgssmRemoteCallErrorComponent', () => {
  let component: NgssmRemoteCallErrorComponent;
  let fixture: ComponentFixture<NgssmRemoteCallErrorComponent>;
  let store: StoreMock;
  let loader: HarnessLoader;
  const remoteCallId = 'testing';

  beforeEach(async () => {
    store = new StoreMock({
      [NgssmRemoteCallStateSpecification.featureStateKey]: NgssmRemoteCallStateSpecification.initialState
    });
    await TestBed.configureTestingModule({
      imports: [NgssmRemoteCallErrorComponent],
      providers: [{ provide: Store, useValue: store }],
      teardown: { destroyAfterEach: false }
    }).compileComponents();

    fixture = TestBed.createComponent(NgssmRemoteCallErrorComponent);
    component = fixture.componentInstance;
    fixture.nativeElement.style['min-height'] = '200px';
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it(`should not render the error container when no remote call id is set`, () => {
    const element = fixture.debugElement.query(By.css('.ngssm-remote-call-error-container'));

    expect(element).toBeFalsy();
  });

  describe(`when a remote call id is set`, () => {
    beforeEach(async () => {
      component.remoteCallId = remoteCallId;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    [RemoteCallStatus.done, RemoteCallStatus.inProgress, RemoteCallStatus.none].forEach((status) => {
      it(`should not render the error container when status is '${status}'`, async () => {
        const state = updateNgssmRemoteCallState(store.stateValue, {
          remoteCalls: {
            [remoteCallId]: {
              $set: {
                status,
                error: {
                  title: 'testing'
                },
                message: 'Testing message'
              }
            }
          }
        });
        store.stateValue = state;
        fixture.detectChanges();
        await fixture.whenStable();

        const element = fixture.debugElement.query(By.css('.ngssm-remote-call-error-container'));

        expect(element).toBeFalsy();
      });
    });

    describe(`when remote call status is '${RemoteCallStatus.ko}'`, () => {
      beforeEach(async () => {
        const state = updateNgssmRemoteCallState(store.stateValue, {
          remoteCalls: {
            [remoteCallId]: {
              $set: {
                status: RemoteCallStatus.ko
              }
            }
          }
        });
        store.stateValue = state;
        fixture.detectChanges();
        await fixture.whenStable();
      });

      it(`should render the error container`, () => {
        const element = fixture.debugElement.query(By.css('.ngssm-remote-call-error-container'));

        expect(element).toBeTruthy();
      });

      it(`should hide the container when clicking on the close button`, async () => {
        const element = await loader.getHarness(MatButtonHarness.with({ selector: '.ngssm-remote-call-error-close-button' }));

        await element.click();

        fixture.detectChanges();
        await fixture.whenStable();

        const container = fixture.debugElement.query(By.css('.ngssm-remote-call-error-container'));

        expect(container).toBeFalsy();
      });

      describe(`when message is provided in remote call`, () => {
        beforeEach(async () => {
          const state = updateNgssmRemoteCallState(store.stateValue, {
            remoteCalls: {
              [remoteCallId]: {
                message: { $set: 'Testing error message' }
              }
            }
          });
          store.stateValue = state;
          fixture.detectChanges();
          await fixture.whenStable();
        });

        it(`should render the message when no detailed error is provided`, () => {
          const element = fixture.debugElement.query(By.css('.ngssm-remote-call-error-container'));

          expect(element?.nativeElement.innerHTML).toContain('Testing error message');
        });

        it(`should render the message when detailed error is provided`, async () => {
          const state = updateNgssmRemoteCallState(store.stateValue, {
            remoteCalls: {
              [remoteCallId]: {
                error: {
                  $set: {
                    title: 'with detailed'
                  }
                }
              }
            }
          });
          store.stateValue = state;
          fixture.detectChanges();
          await fixture.whenStable();

          const element = fixture.debugElement.query(By.css('.ngssm-remote-call-error-container'));

          expect(element?.nativeElement.innerHTML).toContain('Testing error message');
        });
      });

      describe(`when no message is provided in remote call`, () => {
        it(`should render the detailed error when it is provided`, async () => {
          const state = updateNgssmRemoteCallState(store.stateValue, {
            remoteCalls: {
              [remoteCallId]: {
                error: {
                  $set: {
                    title: 'testing'
                  }
                }
              }
            }
          });
          store.stateValue = state;
          fixture.detectChanges();
          await fixture.whenStable();

          const element = fixture.debugElement.query(By.css('.ngssm-remote-call-error-container'));

          const pipe = new JsonPipe();
          expect(element?.nativeElement.innerHTML).toContain(
            pipe.transform({
              title: 'testing'
            })
          );
        });

        it(`should render a default message when the detailed error is not provided`, () => {
          const element = fixture.debugElement.query(By.css('.ngssm-remote-call-error-container'));

          expect(element?.nativeElement.innerHTML).toContain('No error description provided!');
        });
      });
    });
  });
});
