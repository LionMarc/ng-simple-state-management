import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardTitle, MatCardHeader } from '@angular/material/card';
import { ICellRendererParams } from 'ag-grid-community';

import { ActionConfirmationPopupParameter } from './action-confirmation-popup-parameter';
import { ActionPopupComponent } from '../ngssm-actions-cell-renderer';

/**
 * The `ActionConfirmationPopupComponent` is a reusable confirmation popup component designed to work with `ag-grid`.
 * It provides a customizable confirmation dialog for user actions, allowing developers to define messages, button labels,
 * and actions dynamically.
 *
 * ### Features:
 * - Displays a confirmation popup with customizable message, button labels, and color.
 * - Integrates with the `ActionPopupComponent` interface for seamless use with `NgssmActionsCellRendererComponent`.
 * - Uses Angular signals for efficient state management.
 * - Supports dynamic initialization with parameters provided by `ag-grid`.
 * - Provides methods to handle user actions (confirm or cancel) and close the popup.
 *
 * ### Usage:
 * This component is typically used as a popup in conjunction with the `NgssmActionsCellRendererComponent`.
 * To configure it, pass an `ActionConfirmationPopupParameter` object when initializing the popup.
 *
 * Example:
 * ```typescript
 * const popupParameter: ActionConfirmationPopupParameter = {
 *   messageBuilder: (params) => `Are you sure you want to delete ${params.data.name}?`,
 *   color: 'warn',
 *   cancelButtonLabel: 'No',
 *   confirmButtonLabel: 'Yes',
 *   confirmAction: (params) => console.log('Confirmed action for:', params.data)
 * };
 * ```
 *
 * ### Inputs:
 * - `popupRendered`: A writable signal indicating whether the popup is currently rendered.
 * - `params`: The cell renderer parameters provided by `ag-grid`.
 * - `popupParameter`: An object of type `ActionConfirmationPopupParameter` that defines the popup's behavior and content.
 *
 * ### Outputs:
 * None.
 *
 * ### Dependencies:
 * - Angular Material components: `MatCard`, `MatButton`.
 * - `ag-grid-community` for integration with `ag-grid`.
 *
 * ### Methods:
 * - `init(popupRendered, params, popupParameter)`: Initializes the popup with the provided parameters.
 *   - `popupRendered`: A writable signal to track the popup's visibility.
 *   - `params`: The cell renderer parameters from `ag-grid`.
 *   - `popupParameter`: The configuration object for the popup.
 *
 * - `closePopup()`: Closes the popup by setting the `isOpen` signal to `false`.
 *
 * - `executeAction()`: Executes the confirmation action defined in the `popupParameter` and closes the popup.
 *
 * ### Signals:
 * - `message`: The message displayed in the popup.
 * - `cancelButtonLabel`: The label for the cancel button.
 * - `confirmButtonLabel`: The label for the confirm button.
 * - `color`: The color theme for the confirm button (e.g., 'primary', 'warn').
 * - `isOpen`: Tracks whether the popup is currently open.
 *
 * ### Example Initialization:
 * ```typescript
 * const popup = new ActionConfirmationPopupComponent();
 * popup.init(
 *   popupRenderedSignal,
 *   cellRendererParams,
 *   {
 *     messageBuilder: (params) => `Are you sure you want to delete ${params.data.name}?`,
 *     color: 'warn',
 *     cancelButtonLabel: 'No',
 *     confirmButtonLabel: 'Yes',
 *     confirmAction: (params) => console.log('Confirmed action for:', params.data)
 *   }
 * );
 * ```
 *
 * ### Notes:
 * - Ensure that the `popupParameter` object is properly configured to avoid runtime errors.
 * - The `messageBuilder` function in `popupParameter` allows dynamic message generation based on the `params` object.
 * - The component uses `ChangeDetectionStrategy.OnPush` for performance optimization.
 * - The `isOpen` signal can be used to programmatically control the popup's visibility.
 */
@Component({
  selector: 'ngssm-action-confirmation-popup',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardActions, MatButton],
  templateUrl: './action-confirmation-popup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionConfirmationPopupComponent implements ActionPopupComponent<unknown, unknown, ActionConfirmationPopupParameter> {
  private params?: ICellRendererParams;
  private popupParameter?: ActionConfirmationPopupParameter;
  public readonly message = signal<string>('No message');
  public readonly cancelButtonLabel = signal<string>('No');
  public readonly confirmButtonLabel = signal<string>('Yes');
  public readonly color = signal<string>('primary');

  public isOpen = signal<boolean>(false);

  public init(
    popupRendered: WritableSignal<boolean>,
    params?: ICellRendererParams<unknown, unknown>,
    popupParameter?: ActionConfirmationPopupParameter
  ): void {
    this.params = params;
    this.popupParameter = popupParameter;

    this.message.set(popupParameter?.messageBuilder?.(params) ?? 'No message');
    this.color.set(popupParameter?.color ?? 'primary');
    this.cancelButtonLabel.set(popupParameter?.cancelButtonLabel ?? 'Cancel');
    this.confirmButtonLabel.set(popupParameter?.confirmButtonLabel ?? 'Confirm');

    this.isOpen = popupRendered;
  }

  public closePopup(): void {
    this.isOpen.set(false);
  }

  public executeAction(): void {
    this.popupParameter?.confirmAction?.(this.params);
    this.closePopup();
  }
}
