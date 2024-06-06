export enum NgssmDataActionType {
  // Used by the library to initialize all the data sources provided by the application
  registerDataSources = '[NgssmDataActionType] registerDataSources',

  // Could be used by the application to register or unregister a data source.
  // This can be used, for example, to limit the lifetime of a data source to the lifetime of a component
  registerDataSource = '[NgssmDataActionType] registerDataSource',
  unregisterDataSource = '[NgssmDataActionType] unregisterDataSource',

  // Used to call the loading method to get the value for the data source
  loadDataSourceValue = '[NgssmDataActionType] loadDataSourceValue',

  // Update the parameter used by the loading method, if one is required
  setDataSourceParameter = '[NgssmDataActionType] setDataSourceParameter',

  // Clear the stored value associated to a data source
  clearDataSourceValue = '[NgssmDataActionType] clearDataSourceValue',

  // Store the value for a given data source
  setDataSourceValue = '[NgssmDataActionType] setDataSourceValue',

  // Call the loading method to get the value for an additional property of the data source
  loadDataSourceAdditionalPropertyValue = '[NgssmDataActionType] loadDataSourceAdditionalPropertyValue',

  // Store the value for an additional property of the data source
  setDataSourceAdditionalPropertyValue = '[NgssmDataActionType] setDataSourceAdditionalPropertyValue'
}
