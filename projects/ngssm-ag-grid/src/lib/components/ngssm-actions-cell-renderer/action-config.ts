import { Signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ICellRendererParams } from 'ag-grid-community';

export type ActionDisabledFunc<TData = unknown, TValue = unknown> = (params: ICellRendererParams<TData, TValue>) => boolean;
export type ActionHiddenFunc<TData = unknown, TValue = unknown> = (params: ICellRendererParams<TData, TValue>) => boolean;

/**
 * Configuration interface for defining actions in a cell renderer.
 *
 * @template TData - The type of the data associated with the row.
 * @template TValue - The type of the value associated with the cell.
 */
export interface ActionConfig<TData = unknown, TValue = unknown> {
  /**
   * The CSS class used for the icon to render.
   */
  cssClass: string;

  /**
   * The color theme for the action element. Possible values are 'primary', 'accent', or 'warn'.
   * Defaults to 'primary' if not specified.
   */
  color?: string;

  /**
   * Determines whether the action is disabled. This can be a function, an observable, or a signal
   * that evaluates to a boolean value.
   *
   * - If a function is provided, it receives the cell renderer parameters and returns a boolean.
   * - If an observable or signal is provided, it emits a boolean value.
   */
  isDisabled?: ActionDisabledFunc<TData, TValue> | Observable<boolean> | Signal<boolean>;

  /**
   * Determines whether the action is hidden. This can be a function, an observable, or a signal
   * that evaluates to a boolean value.
   *
   * - If a function is provided, it receives the cell renderer parameters and returns a boolean.
   * - If an observable or signal is provided, it emits a boolean value.
   */
  isHidden?: ActionHiddenFunc<TData, TValue> | Observable<boolean> | Signal<boolean>;

  /**
   * The callback function to execute when the action is clicked.
   * Receives the cell renderer parameters as an argument.
   */
  click?: (params: ICellRendererParams<TData, TValue>) => void;

  /**
   * The tooltip text to display when hovering over the action element.
   */
  tooltip?: string;
}
