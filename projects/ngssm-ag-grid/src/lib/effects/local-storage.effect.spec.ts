import { TestBed } from '@angular/core/testing';
import { updateAgGridState } from 'ngssm-ag-grid';

import { StoreMock } from 'ngssm-store/testing';

import { AgGridAction, AgGridActionType, RegisterAgGridStateAction } from '../actions';
import { AgGridStateSpecification, ChangeOrigin } from '../state';
import { LocalStorageEffect } from './local-storage.effect';

describe('LocalStorageEffect', () => {
  let effect: LocalStorageEffect;
  let store: StoreMock;

  beforeEach(() => {
    store = new StoreMock({
      [AgGridStateSpecification.featureStateKey]: AgGridStateSpecification.initialState
    });
    TestBed.configureTestingModule({
      imports: [],
      providers: [LocalStorageEffect]
    });
    effect = TestBed.inject(LocalStorageEffect);
  });

  [AgGridActionType.saveColumnsStateOnDisk, AgGridActionType.resetColumnsStateFromDisk].forEach((actionType) => {
    it(`should process action of type '${actionType}'`, () => {
      expect(effect.processedActions).toContain(actionType);
    });
  });

  describe(`when processing action of type '${AgGridActionType.saveColumnsStateOnDisk}'`, () => {
    it('should not call the localStorage when there is no columns state set in store', () => {
      spyOn(window.localStorage, 'setItem');
      const state = updateAgGridState(store.stateValue, {
        gridStates: {}
      });

      effect.processAction(store, state, new AgGridAction(AgGridActionType.saveColumnsStateOnDisk, 'items'));

      expect(window.localStorage.setItem).not.toHaveBeenCalled();
    });

    it('should call the localStorage when columns state is set in store', () => {
      spyOn(window.localStorage, 'setItem');
      const state = updateAgGridState(store.stateValue, {
        gridStates: {
          items: {
            $set: {
              origin: ChangeOrigin.other,
              columnsState: [{ colId: 'id' }]
            }
          }
        }
      });

      effect.processAction(store, state, new AgGridAction(AgGridActionType.saveColumnsStateOnDisk, 'items'));

      expect(window.localStorage.setItem).toHaveBeenCalledWith('ngssm-ag-grid_items', JSON.stringify([{ colId: 'id' }]));
    });
  });

  describe(`when processing action of type '${AgGridActionType.resetColumnsStateFromDisk}'`, () => {
    it('should dispatch no action when there is nothing in the local storage', () => {
      spyOn(window.localStorage, 'getItem').and.returnValue(null);
      spyOn(store, 'dispatchAction');

      effect.processAction(store, store.stateValue, new AgGridAction(AgGridActionType.resetColumnsStateFromDisk, 'items'));

      expect(store.dispatchAction).not.toHaveBeenCalled();
    });

    it('should dispatch no action when data stored in localstorage is invalid', () => {
      spyOn(window.localStorage, 'getItem').and.returnValue('bad data');
      spyOn(store, 'dispatchAction');

      effect.processAction(store, store.stateValue, new AgGridAction(AgGridActionType.resetColumnsStateFromDisk, 'items'));

      expect(store.dispatchAction).not.toHaveBeenCalled();
    });

    it(`should dispatch a '${AgGridActionType.registerAgGridState}' action when data stored in localstorage is correct`, () => {
      spyOn(window.localStorage, 'getItem').and.returnValue(`[{ "colId": "id" }]`);
      spyOn(store, 'dispatchAction');

      effect.processAction(store, store.stateValue, new AgGridAction(AgGridActionType.resetColumnsStateFromDisk, 'items'));

      expect(store.dispatchAction).toHaveBeenCalledWith(new RegisterAgGridStateAction('items', ChangeOrigin.other, [{ colId: 'id' }]));
    });
  });
});
