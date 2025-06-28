import { inject, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';
import { HideElementAction, ShowElementAction, ToggleElementVisibilityAction, VisibilityReducer } from 'ngssm-store/visibility';

/**
 * Utility service for manipulating element visibility state in the StoreMock during tests.
 * Provides methods to show, hide, or toggle the visibility of an element.
 */
@Injectable()
export class NgssmVisibilitySetter {
  private readonly reducer = new VisibilityReducer();
  public readonly store = inject(Store) as unknown as StoreMock;

  /**
   * Sets the specified element as visible in the StoreMock.
   * @param elementKey The key of the element to show.
   * @returns The NgssmVisibilitySetter instance for chaining.
   */
  public showElement(elementKey: string): NgssmVisibilitySetter {
    this.store.stateValue = this.reducer.updateState(this.store.stateValue, new ShowElementAction(elementKey));
    return this;
  }

  /**
   * Sets the specified element as hidden in the StoreMock.
   * @param elementKey The key of the element to hide.
   * @returns The NgssmVisibilitySetter instance for chaining.
   */
  public hideElement(elementKey: string): NgssmVisibilitySetter {
    this.store.stateValue = this.reducer.updateState(this.store.stateValue, new HideElementAction(elementKey));
    return this;
  }

  /**
   * Toggles the visibility of the specified element in the StoreMock.
   * @param elementKey The key of the element to toggle.
   * @returns The NgssmVisibilitySetter instance for chaining.
   */
  public toggleElementVisibility(elementKey: string): NgssmVisibilitySetter {
    this.store.stateValue = this.reducer.updateState(this.store.stateValue, new ToggleElementVisibilityAction(elementKey));
    return this;
  }
}

/**
 * Helper function to retrieve the NgssmVisibilitySetter instance from the TestBed.
 */
export const ngssmVisibilitySetter = () => TestBed.inject(NgssmVisibilitySetter);
