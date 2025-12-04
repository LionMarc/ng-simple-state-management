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

  afterEach(() => {
    vitest.resetAllMocks();
  });

  [AgGridActionType.saveColumnStatesOnDisk, AgGridActionType.resetColumnStatesFromDisk].forEach((actionType) => {
    it(`should process action of type '${actionType}'`, () => {
      expect(effect.processedActions).toContain(actionType);
    });
  });

  describe(`when processing action of type '${AgGridActionType.saveColumnStatesOnDisk}'`, () => {
    it('should not call the localStorage when there is no columns state set in store', () => {
      vi.spyOn(Storage.prototype, 'setItem');
      const state = updateAgGridState(store.stateValue, {
        gridStates: {}
      });

      effect.processAction(store, state, new AgGridAction(AgGridActionType.saveColumnStatesOnDisk, 'items'));

      expect(window.localStorage.setItem).not.toHaveBeenCalled();
    });

    it('should call the localStorage when columns state is set in store', () => {
      vi.spyOn(Storage.prototype, 'setItem');
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

      effect.processAction(store, state, new AgGridAction(AgGridActionType.saveColumnStatesOnDisk, 'items'));

      expect(localStorage.setItem).toHaveBeenCalledWith('ngssm-ag-grid_items', JSON.stringify([{ colId: 'id' }]));
      expect(localStorage.setItem).toHaveBeenCalledWith('ngssm-ag-grid_groups_items', JSON.stringify([{ groupId: 'test', open: true }]));
    });
  });

  describe(`when processing action of type '${AgGridActionType.resetColumnStatesFromDisk}'`, () => {
    it('should dispatch no action when there is nothing in the local storage', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
      vi.spyOn(store, 'dispatchAction');

      effect.processAction(store, store.stateValue, new AgGridAction(AgGridActionType.resetColumnStatesFromDisk, 'items'));

      expect(store.dispatchAction).not.toHaveBeenCalled();
    });

    it('should dispatch no action when data stored in localstorage is invalid', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('bad data');
      vi.spyOn(store, 'dispatchAction');

      effect.processAction(store, store.stateValue, new AgGridAction(AgGridActionType.resetColumnStatesFromDisk, 'items'));

      expect(store.dispatchAction).not.toHaveBeenCalled();
    });

    it(`should dispatch a '${AgGridActionType.registerAgGridState}' action when data stored in localstorage is correct`, () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
        if (key.includes('_filters')) {
          return '{}';
        }

        if (key.includes('_groups')) {
          return `[{"groupId":"test","open":true}]`;
        }

        return `[{ "colId": "id" }]`;
      });

      vi.spyOn(store, 'dispatchAction');

      effect.processAction(store, store.stateValue, new AgGridAction(AgGridActionType.resetColumnStatesFromDisk, 'items'));

      expect(store.dispatchAction).toHaveBeenCalledWith(
        new RegisterAgGridStateAction('items', ChangeOrigin.other, [{ colId: 'id' }], [{ groupId: 'test', open: true }], {})
      );
    });
  });
});
