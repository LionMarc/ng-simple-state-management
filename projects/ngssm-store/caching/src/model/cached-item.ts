import { CachedItemStatus } from './cached-item-status';

export interface CachedItem<TData = unknown> {
  status: CachedItemStatus;
  item?: TData;
  error?: string;
}
