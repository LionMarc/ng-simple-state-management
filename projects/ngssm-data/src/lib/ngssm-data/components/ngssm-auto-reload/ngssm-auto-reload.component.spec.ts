import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';

import { StoreMock } from 'ngssm-store/testing';
import { Store } from 'ngssm-store';

import { NgssmAutoReloadComponent } from './ngssm-auto-reload.component';

describe('NgssmAutoReloadComponent', () => {
  let component: NgssmAutoReloadComponent;
  let fixture: ComponentFixture<NgssmAutoReloadComponent>;
  let store: StoreMock;
  let loader: HarnessLoader;

  beforeEach(() => {
    vitest.useFakeTimers();
  });

  afterEach(() => {
    vitest.useRealTimers();
  });

  beforeEach(async () => {
    store = new StoreMock({});
    await TestBed.configureTestingModule({
      imports: [NgssmAutoReloadComponent],
      providers: [{ provide: Store, useValue: store }],
      teardown: { destroyAfterEach: true }
    }).compileComponents();

    fixture = TestBed.createComponent(NgssmAutoReloadComponent);
    component = fixture.componentInstance;
    fixture.nativeElement.style['min-height'] = '200px';
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should be able to select among the list of auto reload types`, async () => {
    const selector = await loader.getHarness(MatSelectHarness);
    await selector.open();
    const labels: string[] = [];
    const options = await selector.getOptions();
    for (const option of options) {
      const text = await option.getText();
      labels.push(text);
    }

    expect(labels).toEqual(['Off', 'Every minute', 'Every 5 minutes', 'Every 15 minutes']);

    await selector.close();
  });

  it(`should execute the callback when auto reload is not off`, async () => {
    let called = false;
    fixture.componentRef.setInput('autoReloadAction', () => (called = true));
    const selector = await loader.getHarness(MatSelectHarness);
    await selector.open();
    await selector.clickOptions({ text: 'Every minute' });

    await vi.advanceTimersByTimeAsync(60001);

    expect(called).toBe(true);
  });
});
