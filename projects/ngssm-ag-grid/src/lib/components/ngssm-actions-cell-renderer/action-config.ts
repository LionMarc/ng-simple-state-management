import { Signal, Type, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

import { ICellRendererParams } from 'ag-grid-community';

/**
 * A function type that determines whether an action is disabled.
 *
 * @template TData - The type of the data associated with the row.
 * @template TValue - The type of the value associated with the cell.
 * @param params - The cell renderer parameters provided by `ag-grid`.
 * @returns A boolean indicating whether the action is disabled.
 */
export type ActionDisabledFunc<TData = unknown, TValue = unknown> = (params: ICellRendererParams<TData, TValue>) => boolean;

/**
 * A function type that determines whether an action is hidden.
 *
 * @template TData - The type of the data associated with the row.
 * @template TValue - The type of the value associated with the cell.
 * @param params - The cell renderer parameters provided by `ag-grid`.
 * @returns A boolean indicating whether the action is hidden.
 */
export type ActionHiddenFunc<TData = unknown, TValue = unknown> = (params: ICellRendererParams<TData, TValue>) => boolean;

/**
 * Interface for defining a popup component associated with an action.
 *
 * @template TData - The type of the data associated with the row.
 * @template TValue - The type of the value associated with the cell.
 * @template TPopupParameter - The type of the parameter passed to the popup component.
 */
export interface ActionPopupComponent<TData = unknown, TValue = unknown, TPopupParameter = unknown> {
  /**
   * An optional initialization function for the popup component.
   *
   * @param popupRendered - A writable signal indicating whether the popup is rendered.
   * @param params - The cell renderer parameters provided by `ag-grid`.
   * @param popupParameter - Additional parameters for the popup component.
   */
  init?: (popupRendered: WritableSignal<boolean>, params?: ICellRendererParams<TData, TValue>, popupParameter?: TPopupParameter) => void;
}

/**
 * Configuration interface for defining actions in a cell renderer.
 *
 * @template TData - The type of the data associated with the row.
 * @template TValue - The type of the value associated with the cell.
 * @template TPopupComponent - The type of the popup component associated with the action.
 * @template TPopupParameter - The type of the parameter passed to the popup component.
 */
export interface ActionConfig<TData = unknown, TValue = unknown, TPopupComponent = unknown, TPopupParameter = unknown> {
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

  /**
   * The Angular component to render as a popup when the action is triggered.
   */
  popupComponent?: Type<TPopupComponent>;

  /**
   * Additional parameters to pass to the popup component.
   */
  popupParameter?: TPopupParameter;
}
