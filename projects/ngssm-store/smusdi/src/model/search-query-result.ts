export interface SearchQueryResult<TData> {
  maxResults: number;
  totalResults: number;
  results: TData[];
}
