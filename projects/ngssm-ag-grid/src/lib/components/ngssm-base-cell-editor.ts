import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams } from 'ag-grid-community';

export abstract class NgssmBaseCellEditor implements ICellEditorAngularComp {
  protected params?: ICellEditorParams;

  public agInit(params: ICellEditorParams): void {
    this.params = params;
  }

  public getValue() {
    return '';
  }

  public isPopup(): boolean {
    return true;
  }

  public getPopupPosition(): 'over' | 'under' | undefined {
    return 'over';
  }

  public isCancelAfterEnd(): boolean {
    return true;
  }

  public cancel(): void {
    this.params?.stopEditing();
  }
}
