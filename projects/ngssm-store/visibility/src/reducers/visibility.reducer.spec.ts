import { State } from 'ngssm-store';

import { VisibilityReducer } from './visibility.reducer';
import { NgssmVisibilityActionType, ShowElementAction } from '../actions';
import { NgssmVisibilityStateSpecification, selectNgssmVisibilityState, updateNgssmVisibilityState } from '../state';

describe('VisibilityReducer', () => {
    let reducer: VisibilityReducer;
    let state: State;

    beforeEach(() => {
        reducer = new VisibilityReducer();
        state = {
            [NgssmVisibilityStateSpecification.featureStateKey]: NgssmVisibilityStateSpecification.initialState
        };
    });

    [
        NgssmVisibilityActionType.toggleElementVisibility,
        NgssmVisibilityActionType.showElement,
        NgssmVisibilityActionType.hideElement,
        NgssmVisibilityActionType.defineElementsGroup
    ].forEach((actionType: string) => {
        it(`should process action of type '${actionType}'`, () => {
            expect(reducer.processedActions).toContain(actionType);
        });
    });

    it('should return input state when processing not valid action type', () => {
        const updatedState = reducer.updateState(state, { type: 'not-processed' });

        expect(updatedState).toBe(state);
    });

    describe(`when processing action of type '${NgssmVisibilityActionType.showElement}'`, () => {
        const action = new ShowElementAction('testing');

        it(`should set element as visible`, () => {
            state = updateNgssmVisibilityState(state, {
                elements: {
                    ['testing']: { $set: false }
                }
            });

            const updatedState = reducer.updateState(state, action);

            expect(selectNgssmVisibilityState(updatedState).elements['testing']).toBe(true);
        });

        it(`should set all elements of groups associated to the updated element as not visible`, () => {
            state = updateNgssmVisibilityState(state, {
                elements: {
                    ['testing']: { $set: false },
                    ['one']: { $set: true },
                    ['two']: { $set: true },
                    ['three']: { $set: true }
                },
                elementsGroups: { $set: [['testing', 'one', 'two']] }
            });

            const updatedState = reducer.updateState(state, action);

            expect(selectNgssmVisibilityState(updatedState).elements['one']).toBe(false);
            expect(selectNgssmVisibilityState(updatedState).elements['two']).toBe(false);
            expect(selectNgssmVisibilityState(updatedState).elements['three']).toBe(true);
        });
    });
});
