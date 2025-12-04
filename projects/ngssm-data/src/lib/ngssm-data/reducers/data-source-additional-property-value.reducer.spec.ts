import { HttpErrorResponse } from '@angular/common/http';

import { State } from 'ngssm-store';

import { DateTime } from 'luxon';

import { NgssmDataActionType, NgssmLoadDataSourceAdditionalPropertyValueAction, NgssmSetDataSourceAdditionalPropertyValueAction } from '../actions';
import { NgssmDataSourceValueStatus } from '../model';
import { NgssmDataStateSpecification, selectNgssmDataState, updateNgssmDataState } from '../state';
import { DataSourceAdditionalPropertyValueReducer } from './data-source-additional-property-value.reducer';

describe('DataSourceAdditionalPropertyValueReducer', () => {
    let reducer: DataSourceAdditionalPropertyValueReducer;
    let state: State;

    beforeEach(() => {
        reducer = new DataSourceAdditionalPropertyValueReducer();
        state = {
            [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState
        };
    });

    [NgssmDataActionType.loadDataSourceAdditionalPropertyValue, NgssmDataActionType.setDataSourceAdditionalPropertyValue].forEach((actionType: string) => {
        it(`should process action of type '${actionType}'`, () => {
            expect(reducer.processedActions).toContain(actionType);
        });
    });

    it('should return input state when processing not valid action type', () => {
        const updatedState = reducer.updateState(state, { type: 'not-processed' });

        expect(updatedState).toBe(state);
    });

    describe(`when processing action of type '${NgssmDataActionType.loadDataSourceAdditionalPropertyValue}'`, () => {
        it(`should add property into state when property does not exist`, () => {
            state = updateNgssmDataState(state, {
                dataSourceValues: {
                    ['data-providers']: {
                        $set: {
                            status: NgssmDataSourceValueStatus.loading,
                            additionalProperties: {}
                        }
                    }
                }
            });

            const action = new NgssmLoadDataSourceAdditionalPropertyValueAction('data-providers', 'testing');

            const updatedState = reducer.updateState(state, action);

            expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers'].additionalProperties).toEqual({
                testing: {
                    status: NgssmDataSourceValueStatus.loading
                }
            });
        });

        [NgssmDataSourceValueStatus.error, NgssmDataSourceValueStatus.loading, NgssmDataSourceValueStatus.none].forEach((status) => {
            it(`should set the property status to ${NgssmDataSourceValueStatus.loading} when it is ${status}`, () => {
                state = updateNgssmDataState(state, {
                    dataSourceValues: {
                        ['data-providers']: {
                            $set: {
                                status: NgssmDataSourceValueStatus.loading,
                                additionalProperties: {
                                    testing: {
                                        status
                                    }
                                }
                            }
                        }
                    }
                });

                const action = new NgssmLoadDataSourceAdditionalPropertyValueAction('data-providers', 'testing');

                const updatedState = reducer.updateState(state, action);

                expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers'].additionalProperties).toEqual({
                    testing: {
                        status: NgssmDataSourceValueStatus.loading
                    }
                });
            });
        });

        it(`should not update the property status when it is ${NgssmDataSourceValueStatus.loaded} and action does not force reload`, () => {
            state = updateNgssmDataState(state, {
                dataSourceValues: {
                    ['data-providers']: {
                        $set: {
                            status: NgssmDataSourceValueStatus.loading,
                            additionalProperties: {
                                testing: {
                                    status: NgssmDataSourceValueStatus.loaded
                                }
                            }
                        }
                    }
                }
            });

            const action = new NgssmLoadDataSourceAdditionalPropertyValueAction('data-providers', 'testing');

            const updatedState = reducer.updateState(state, action);

            expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers'].additionalProperties).toEqual({
                testing: {
                    status: NgssmDataSourceValueStatus.loaded
                }
            });
        });

        it(`should not update the property status to ${NgssmDataSourceValueStatus.loading} when it is ${NgssmDataSourceValueStatus.loaded} and action forces reload`, () => {
            state = updateNgssmDataState(state, {
                dataSourceValues: {
                    ['data-providers']: {
                        $set: {
                            status: NgssmDataSourceValueStatus.loading,
                            additionalProperties: {
                                testing: {
                                    status: NgssmDataSourceValueStatus.loaded
                                }
                            }
                        }
                    }
                }
            });

            const action = new NgssmLoadDataSourceAdditionalPropertyValueAction('data-providers', 'testing', true);

            const updatedState = reducer.updateState(state, action);

            expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers'].additionalProperties).toEqual({
                testing: {
                    status: NgssmDataSourceValueStatus.loading
                }
            });
        });

        it(`should not reset the value when the value is already set`, () => {
            state = updateNgssmDataState(state, {
                dataSourceValues: {
                    ['data-providers']: {
                        $set: {
                            status: NgssmDataSourceValueStatus.loading,
                            additionalProperties: {
                                testing: {
                                    status: NgssmDataSourceValueStatus.loaded,
                                    value: 'testing'
                                }
                            }
                        }
                    }
                }
            });

            const action = new NgssmLoadDataSourceAdditionalPropertyValueAction('data-providers', 'testing', true);

            const updatedState = reducer.updateState(state, action);

            expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers'].additionalProperties).toEqual({
                testing: {
                    status: NgssmDataSourceValueStatus.loading,
                    value: 'testing'
                }
            });
        });
    });

    describe(`when processing action of type '${NgssmDataActionType.setDataSourceAdditionalPropertyValue}'`, () => {
        it(`should update the state with the value set in action when additional property exists in state`, () => {
            state = updateNgssmDataState(state, {
                dataSourceValues: {
                    ['data-providers']: {
                        $set: {
                            status: NgssmDataSourceValueStatus.loaded,
                            additionalProperties: {
                                testing: {
                                    status: NgssmDataSourceValueStatus.loaded,
                                    value: {
                                        label: 'for testing'
                                    }
                                }
                            }
                        }
                    }
                }
            });

            const now = DateTime.now();
            vi.spyOn(DateTime, 'now').mockReturnValue(now);

            const action = new NgssmSetDataSourceAdditionalPropertyValueAction('data-providers', 'testing', NgssmDataSourceValueStatus.loaded, {
                title: 'to test update'
            });

            const updatedState = reducer.updateState(state, action);

            expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers'].additionalProperties).toEqual({
                testing: {
                    status: NgssmDataSourceValueStatus.loaded,
                    value: {
                        title: 'to test update'
                    },
                    lastLoadingDate: now,
                    httpErrorResponse: undefined
                }
            });
        });

        it(`should update the state with the value set in action when additional property does not exist in state`, () => {
            state = updateNgssmDataState(state, {
                dataSourceValues: {
                    ['data-providers']: {
                        $set: {
                            status: NgssmDataSourceValueStatus.loaded,
                            additionalProperties: {}
                        }
                    }
                }
            });

            const now = DateTime.now();
            vi.spyOn(DateTime, 'now').mockReturnValue(now);

            const action = new NgssmSetDataSourceAdditionalPropertyValueAction('data-providers', 'testing', NgssmDataSourceValueStatus.loaded, {
                title: 'to test update'
            });

            const updatedState = reducer.updateState(state, action);

            expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers'].additionalProperties).toEqual({
                testing: {
                    status: NgssmDataSourceValueStatus.loaded,
                    value: {
                        title: 'to test update'
                    },
                    lastLoadingDate: now,
                    httpErrorResponse: undefined
                }
            });
        });

        it(`should update additional property error with the error set in action`, () => {
            state = updateNgssmDataState(state, {
                dataSourceValues: {
                    ['data-providers']: {
                        $set: {
                            status: NgssmDataSourceValueStatus.loaded,
                            additionalProperties: {
                                testing: {
                                    status: NgssmDataSourceValueStatus.loaded,
                                    value: {
                                        label: 'for testing'
                                    }
                                }
                            }
                        }
                    }
                }
            });

            const action = new NgssmSetDataSourceAdditionalPropertyValueAction('data-providers', 'testing', NgssmDataSourceValueStatus.loaded, {
                title: 'to test update'
            }, undefined, {
                message: 'ko'
            } as unknown as HttpErrorResponse);

            const updatedState = reducer.updateState(state, action);

            expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers'].additionalProperties['testing']?.httpErrorResponse).toEqual({
                message: 'ko'
            } as unknown as HttpErrorResponse);
        });
    });
});
