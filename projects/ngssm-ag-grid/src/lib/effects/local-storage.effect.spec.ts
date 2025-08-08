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

  [AgGridActionType.savecolumnStatesOnDisk, AgGridActionType.resetcolumnStatesFromDisk].forEach((actionType) => {
    it(`should process action of type '${actionType}'`, () => {
      expect(effect.processedActions).toContain(actionType);
    });
  });

  describe(`when processing action of type '${AgGridActionType.savecolumnStatesOnDisk}'`, () => {
    it('should not call the localStorage when there is no columns state set in store', () => {
      spyOn(window.localStorage, 'setItem');
      const state = updateAgGridState(store.stateValue, {
        gridStates: {}
      });

      effect.processAction(store, state, new AgGridAction(AgGridActionType.savecolumnStatesOnDisk, 'items'));

      expect(window.localStorage.setItem).not.toHaveBeenCalled();
    });

    it('should call the localStorage when columns state is set in store', () => {
      spyOn(window.localStorage, 'setItem');
      const state = updateAgGridState(store.stateValue, {
        gridStates: {
          items: {
            $set: {
              origin: ChangeOrigin.other,
              columnStates: [{ colId: 'id' }],
              columnGroupStates: [{ groupId: 'test', open: true }],
              filterModel: null
            }
          }
        }
      });

      effect.processAction(store, state, new AgGridAction(AgGridActionType.savecolumnStatesOnDisk, 'items'));

      expect(window.localStorage.setItem).toHaveBeenCalledWith('ngssm-ag-grid_items', JSON.stringify([{ colId: 'id' }]));
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'ngssm-ag-grid_groups_items',
        JSON.stringify([{ groupId: 'test', open: true }])
      );
    });
  });

  describe(`when processing action of type '${AgGridActionType.resetcolumnStatesFromDisk}'`, () => {
    it('should dispatch no action when there is nothing in the local storage', () => {
      spyOn(window.localStorage, 'getItem').and.returnValue(null);
      spyOn(store, 'dispatchAction');

      effect.processAction(store, store.stateValue, new AgGridAction(AgGridActionType.resetcolumnStatesFromDisk, 'items'));

      expect(store.dispatchAction).not.toHaveBeenCalled();
    });

    it('should dispatch no action when data stored in localstorage is invalid', () => {
      spyOn(window.localStorage, 'getItem').and.returnValue('bad data');
      spyOn(store, 'dispatchAction');

      effect.processAction(store, store.stateValue, new AgGridAction(AgGridActionType.resetcolumnStatesFromDisk, 'items'));

      expect(store.dispatchAction).not.toHaveBeenCalled();
    });

    it(`should dispatch a '${AgGridActionType.registerAgGridState}' action when data stored in localstorage is correct`, () => {
      spyOn(window.localStorage, 'getItem').and.callFake((key) => {
        if (key.includes('_filters')) {
          return '{}';
        }

        if (key.includes('_groups')) {
          return `[{"groupId":"test","open":true}]`;
        }

        return `[{ "colId": "id" }]`;
      });

      spyOn(store, 'dispatchAction');

      effect.processAction(store, store.stateValue, new AgGridAction(AgGridActionType.resetcolumnStatesFromDisk, 'items'));

      expect(store.dispatchAction).toHaveBeenCalledWith(
        new RegisterAgGridStateAction('items', ChangeOrigin.other, [{ colId: 'id' }], [{ groupId: 'test', open: true }], {})
      );
    });
  });
});
