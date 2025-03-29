/**
 * The `NgssmActionsCellRendererComponent` is a custom cell renderer for `ag-grid` that dynamically renders
 * action buttons within a grid cell. It provides flexibility in configuring button behavior, visibility, and state.
 *
 * ### Features:
 * - Dynamically generates action buttons based on the provided configuration.
 * - Supports reactive state management using Angular signals.
 * - Integrates with observables, functions, or signals for `isDisabled` and `isHidden` properties.
 * - Provides customizable tooltips and button styles.
 * - Executes custom actions when buttons are clicked.
 *
 * ### Usage:
 * To use this component, provide it as a cell renderer in your `ag-grid` column definition:
 *
 * ```typescript
 * columnDefs: [
 *   {
 *     headerName: 'Actions',
 *     field: 'actions',
 *     cellRenderer: NgssmActionsCellRendererComponent,
 *     cellRendererParams: {
 *       actions: [
 *         {
 *           cssClass: 'delete-button',
 *           color: 'warn',
 *           tooltip: 'Delete Item',
 *           isDisabled: (params) => params.data.isLocked,
 *           isHidden: (params) => !params.data.canDelete,
 *           click: (params) => console.log('Delete action clicked', params)
 *         }
 *       ]
 *     }
 *   }
 * ];
 * ```
 *
 * ### Inputs:
 * - `NgssmActionsCellRendererParams`: Configuration object passed to the component via `cellRendererParams`.
 *   - `actions`: Array of `ActionConfig` objects defining the buttons to render.
 *
 * ### Outputs:
 * None.
 *
 * ### Dependencies:
 * - Angular Material components: `MatIconButton`, `MatIcon`, `MatTooltip`.
 * - `ag-grid-angular` for integration with `ag-grid`.
 *
 * ### Example ActionConfig:
 * ```typescript
 * interface ActionConfig {
 *   cssClass: string; // CSS class for the button.
 *   color?: string; // Button color (e.g., 'primary', 'warn').
 *   tooltip?: string; // Tooltip text for the button.
 *   isDisabled?: boolean | Signal<boolean> | Observable<boolean> | ((params: ICellRendererParams) => boolean);
 *   isHidden?: boolean | Signal<boolean> | Observable<boolean> | ((params: ICellRendererParams) => boolean);
 *   click?: (params: ICellRendererParams) => void; // Action to execute on button click.
 * }
 * ```
 *
 * ### Methods:
 * - `agInit(params: ICellRendererParams)`: Initializes the component with the provided cell renderer parameters.
 * - `refresh(params: ICellRendererParams)`: Refreshes the component state when the grid updates.
 * - `executeAction(action: ActionButton)`: Executes the action associated with a button.
 *
 * ### Internal Logic:
 * - The `setupActions` method initializes the action buttons based on the provided configuration.
 * - The `setUpActionSignal` method handles the initialization of `isDisabled` and `isHidden` states for each button.
 * - The component uses Angular signals (`WritableSignal` and `Signal`) to manage the state of `isDisabled` and `isHidden`.
 * - Observables are converted to signals using `toSignal` for seamless integration with Angular's reactivity system.
 *
 * ### Change Detection:
 * - The component uses `ChangeDetectionStrategy.OnPush` for improved performance by minimizing unnecessary change detection cycles.
 *
 * ### Notes:
 * - Ensure that the `actions` array in `NgssmActionsCellRendererParams` is properly configured to avoid runtime errors.
 * - The component is designed to work with Angular Material and requires the relevant modules to be imported in your application.
 * - The `isDisabled` and `isHidden` properties can accept multiple input types (boolean, function, signal, or observable), providing flexibility in defining button behavior.
 */

import {
  Component,
  ChangeDetectionStrategy,
  signal,
  WritableSignal,
  Signal,
  inject,
  EnvironmentInjector,
  runInInjectionContext,
  isSignal
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconButton } from '@angular/material/button';
import { isObservable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { NgssmActionsCellRendererParams } from './ngssm-actions-cell-renderer-params';
import { ActionConfig } from './action-config';

interface ActionButton {
  cssClass: string;
  color: string;

  isDisabled: WritableSignal<boolean> | Signal<boolean>;
  isHidden: WritableSignal<boolean> | Signal<boolean>;

  actionConfig: ActionConfig;

  tooltip: string;
}

@Component({
  selector: 'ngssm-actions-cell-renderer',
  imports: [MatIconButton, MatIcon, MatTooltip],
  templateUrl: './ngssm-actions-cell-renderer.component.html',
  styleUrls: ['./ngssm-actions-cell-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmActionsCellRendererComponent implements ICellRendererAngularComp {
  private environmentInjector = inject(EnvironmentInjector);
  private cellParams: ICellRendererParams | undefined;

  public readonly actionButtons = signal<ActionButton[]>([]);

  public agInit(params: ICellRendererParams): void {
    this.cellParams = params;
    this.setupActions(params as unknown as NgssmActionsCellRendererParams);
  }

  public refresh(params: ICellRendererParams): boolean {
    this.cellParams = params;
    this.actionButtons().forEach((a) => {
      if (a.actionConfig.isDisabled instanceof Function) {
        (a.isDisabled as WritableSignal<boolean>).set(a.actionConfig.isDisabled(params));
      }

      if (a.actionConfig.isHidden instanceof Function) {
        (a.isHidden as WritableSignal<boolean>).set(a.actionConfig.isHidden(params));
      }
    });
    return true;
  }

  public executeAction(action: ActionButton): void {
    const params = this.cellParams;
    if (params) {
      action.actionConfig.click?.(params);
    }
  }

  private setupActions(rendererParams: NgssmActionsCellRendererParams): void {
    runInInjectionContext(this.environmentInjector, () => {
      const actionButtons: ActionButton[] = (rendererParams?.actions ?? []).map((a) => {
        const actionButton: ActionButton = {
          cssClass: a.cssClass,
          color: a.color ?? 'primary',
          isDisabled: signal(false),
          isHidden: signal(false),
          actionConfig: a,
          tooltip: a.tooltip ?? ''
        };

        this.setUpActionSignal(actionButton, a, rendererParams, 'isDisabled');
        this.setUpActionSignal(actionButton, a, rendererParams, 'isHidden');

        return actionButton;
      });

      this.actionButtons.set(actionButtons);
    });
  }

  private setUpActionSignal(
    actionButton: ActionButton,
    config: ActionConfig,
    rendererParams: NgssmActionsCellRendererParams,
    signalName: 'isDisabled' | 'isHidden'
  ): void {
    const input = config[signalName];

    if (isSignal(input)) {
      actionButton[signalName] = input as Signal<boolean>;
    } else if (input instanceof Function) {
      (actionButton[signalName] as WritableSignal<boolean>).set(input(rendererParams as unknown as ICellRendererParams));
    } else if (isObservable(input)) {
      actionButton[signalName] = toSignal(input, { initialValue: false });
    }
  }
}
