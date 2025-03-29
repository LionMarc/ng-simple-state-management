import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardTitle, MatCardHeader } from '@angular/material/card';
import { ICellRendererParams } from 'ag-grid-community';

import { ActionConfirmationPopupParameter } from './action-confirmation-popup-parameter';
import { ActionPopupComponent } from '../ngssm-actions-cell-renderer';

@Component({
  selector: 'ngssm-action-confirmation-popup',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardActions, MatButton],
  templateUrl: './action-confirmation-popup.component.html',
  styleUrl: './action-confirmation-popup.component.scss',
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

    if (popupParameter) {
      this.message.set(popupParameter.messageBuilder?.(params) ?? 'Default message');
      this.color.set(popupParameter.color ?? 'primary');
      this.cancelButtonLabel.set(popupParameter.cancelButtonLabel ?? 'Cancel');
      this.confirmButtonLabel.set(popupParameter.confirmButtonLabel ?? 'Confirm');
    }

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
