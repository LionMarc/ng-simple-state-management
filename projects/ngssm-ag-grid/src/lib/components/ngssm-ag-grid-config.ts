/**
 * Configuration parameters of the {@link NgssmAgGridDirective} directive to apply on a
 * {@link https://www.ag-grid.com/ ag-grid instance}
 */
export interface NgssmAgGridConfig {
  /**
   * Unique identifier of the grid on which the directive is applied
   */
  gridId: string;

  /**
   * If true, the selected rows are stored in the state and restored when the directive is created.
   */
  keepSelection?: boolean;

  /**
   * If true, context menus are added to the grid to save the columns state into the local storage
   * and to restore from the local storage.
   *
   * @remarks
   *
   * this functionnality is only available for enterprise version of {@link https://www.ag-grid.com/}.
   */
  canSaveOnDiskColumnsState?: boolean;
}
