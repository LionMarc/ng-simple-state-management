export interface NgssmLoadDataSourceOptions<TParameter> {
  forceReload?: boolean;
  keepAdditionalProperties?: boolean;
  parameter?: { value?: TParameter };
  resetValue?: boolean;
}
