import { ICellRendererParams } from 'ag-grid-community';
import { Observable } from 'rxjs';

export interface ActionDisabledFunc<TData = any, TValue = any> {
  (params: ICellRendererParams<TData, TValue>): boolean;
}

export interface ActionConfig<TData = any, TValue = any> {
  cssClass: string;

  // ThemePalette (primary, accent, warn) => by default 'primary'
  color?: string;

  isDisabled?: ActionDisabledFunc<TData, TValue> | Observable<boolean>;

  click?: (params: ICellRendererParams<TData, TValue>) => void;
}
