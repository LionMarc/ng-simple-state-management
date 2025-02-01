import { ShellActionType } from '../actions';
import { NavigationBarReducer } from './navigation-bar.reducer';

describe('NavigationBarReducer', () => {
  let reducer: NavigationBarReducer;

  beforeEach(() => {
    reducer = new NavigationBarReducer();
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
