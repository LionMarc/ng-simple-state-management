import { RemoteDataGetterParams } from './remote-data-getter-params';

export interface ReloadParams<TValue = unknown> {
  forceReload: boolean;
  params?: RemoteDataGetterParams<TValue>;
  keepStoredGetterParams?: boolean;
}
