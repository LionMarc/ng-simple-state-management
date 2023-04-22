import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { By } from '@angular/platform-browser';

import { Store, StoreMock } from 'ngssm-store';

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

    describe(`when no error is set in remote call`, () => {
      [RemoteCallStatus.done, RemoteCallStatus.inProgress, RemoteCallStatus.ko, RemoteCallStatus.none].forEach((status) => {
        it(`should not render the error container when remote call status is '${status}'`, async () => {
          const state = updateNgssmRemoteCallState(store.state$.getValue(), {
            remoteCalls: {
              [remoteCallId]: {
                $set: {
                  status
                }
              }
            }
          });
          store.state$.next(state);
          fixture.detectChanges();
          await fixture.whenStable();

          const element = fixture.debugElement.query(By.css('.ngssm-remote-call-error-container'));

          expect(element).toBeFalsy();
        });
      });
    });

    describe(`when an error is set in remote call`, () => {
      [RemoteCallStatus.done, RemoteCallStatus.inProgress, RemoteCallStatus.ko, RemoteCallStatus.none].forEach((status) => {
        describe(`when status is '${status}'`, () => {
          beforeEach(async () => {
            const state = updateNgssmRemoteCallState(store.state$.getValue(), {
              remoteCalls: {
                [remoteCallId]: {
                  $set: {
                    status,
                    error: {
                      title: 'testing'
                    }
                  }
                }
              }
            });
            store.state$.next(state);
            fixture.detectChanges();
            await fixture.whenStable();
          });

          it(`should render the error container`, () => {
            const element = fixture.debugElement.query(By.css('.ngssm-remote-call-error-container'));

            expect(element).toBeTruthy();
          });

          it(`should render a close button`, async () => {
            const element = fixture.debugElement.query(By.css('.ngssm-remote-call-error-close-button'));

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
        });
      });
    });
  });
});
