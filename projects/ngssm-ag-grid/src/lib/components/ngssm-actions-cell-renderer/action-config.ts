import { ICellRendererParams } from 'ag-grid-community';
import { Observable } from 'rxjs';

export type ActionDisabledFunc<TData = unknown, TValue = unknown> = (params: ICellRendererParams<TData, TValue>) => boolean;

export type ActionHiddenFunc<TData = unknown, TValue = unknown> = (params: ICellRendererParams<TData, TValue>) => boolean;

export interface ActionConfig<TData = unknown, TValue = unknown> {
  cssClass: string;

  // ThemePalette (primary, accent, warn) => by default 'primary'
  color?: string;

  isDisabled?: ActionDisabledFunc<TData, TValue> | Observable<boolean>;

  isHidden?: ActionHiddenFunc<TData, TValue> | Observable<boolean>;

  click?: (params: ICellRendererParams<TData, TValue>) => void;

  tooltip?: string;
}
