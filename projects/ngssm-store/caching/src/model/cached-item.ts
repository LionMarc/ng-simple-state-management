import { CachedItemStatus } from './cached-item-status';

export interface CachedItem<TData = any> {
  status: CachedItemStatus;
  item?: TData;
  error?: string;
}
