import { ShellActionType } from '../actions';
import { ShellStateSpecification } from '../state';
import { NavigationBarReducer } from './navigation-bar.reducer';

describe('NavigationBarReducer', () => {
  let reducer: NavigationBarReducer;
  let state: { [key: string]: any };

  beforeEach(() => {
    reducer = new NavigationBarReducer();
    state = {
      [ShellStateSpecification.featureStateKey]: ShellStateSpecification.initialState
    };
  });

  [
    ShellActionType.toggleNavigationBarState,
    ShellActionType.openNavigationBar,
    ShellActionType.closeNavigationBar,
    ShellActionType.lockNavigationBar
  ].forEach((actionType) => {
    it(`should process action '${actionType}'`, () => {
      expect(reducer.processedActions).toContain(actionType);
    });
  });
});
