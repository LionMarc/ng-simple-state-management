import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams } from 'ag-grid-community';

import { NgSsmComponent, Store } from 'ngssm-store';

export abstract class NgssmBaseCellEditor extends NgSsmComponent implements ICellEditorAngularComp {
  protected params?: ICellEditorParams;

  constructor(store: Store) {
    super(store);
  }

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
