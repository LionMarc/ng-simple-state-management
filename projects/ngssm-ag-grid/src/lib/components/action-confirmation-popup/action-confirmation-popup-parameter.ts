import { ICellRendererParams } from "ag-grid-community";

/**
 * Represents the parameters required for configuring an action confirmation popup.
 * This interface is designed to be used with ag-Grid and provides options for
 * customizing the popup's message, button labels, color, and confirmation action.
 *
 * @template TData - The type of the data associated with the cell.
 * @template TValue - The type of the value associated with the cell.
 */
export interface ActionConfirmationPopupParameter<TData = unknown, TValue = unknown> {
    /**
     * A function that builds the confirmation message to be displayed in the popup.
     *
     * @param params - Optional parameters provided by ag-Grid, including cell data and value.
     * @returns The message to display in the confirmation popup.
     */
    messageBuilder: (params?: ICellRendererParams<TData, TValue>) => string;

    /**
     * The label for the cancel button in the confirmation popup.
     */
    cancelButtonLabel: string;

    /**
     * The label for the confirm button in the confirmation popup.
     */
    confirmButtonLabel: string;

    /**
     * Optional color to customize the appearance of the confirm button.
     */
    color?: string;

    /**
     * An optional function to execute when the confirm button is clicked.
     *
     * @param params - Optional parameters provided by ag-Grid, including cell data and value.
     */
    confirmAction?: (params?: ICellRendererParams<TData, TValue>) => void;
}
