import { State } from 'ngssm-store';
import { NgssmVisibilityStateSpecification, updateNgssmVisibilityState } from '../state';
import { IsElementVisiblePipe } from './is-element-visible.pipe';

describe('IsElementVisiblePipe', () => {
  let state: State;
  let pipe: IsElementVisiblePipe;

  beforeEach(() => {
    state = {
      [NgssmVisibilityStateSpecification.featureStateKey]: NgssmVisibilityStateSpecification.initialState
    };

    pipe = new IsElementVisiblePipe();
  });

  it(`should return true when element is set as visible`, () => {
    state = updateNgssmVisibilityState(state, {
      elements: {
        ['testing']: { $set: true }
      }
    });

    const result = pipe.transform(state, 'testing');

    expect(result).toBeTrue();
  });

  it(`should return false when element is not set as visible`, () => {
    state = updateNgssmVisibilityState(state, {
      elements: {
        ['testing']: { $set: false }
      }
    });

    const result = pipe.transform(state, 'testing');

    expect(result).toBeFalse();
  });

  it(`should return false when element is not set`, () => {
    const result = pipe.transform(state, 'testing');

    expect(result).toBeFalse();
  });
});
