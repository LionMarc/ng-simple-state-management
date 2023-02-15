import { RemoteDataGetterParams } from './remote-data-getter-params';

export interface ReloadParams<TValue = any> {
  forceReload: boolean;
  params?: RemoteDataGetterParams<TValue>;
  keepStoredGetterParams?: boolean;
}
