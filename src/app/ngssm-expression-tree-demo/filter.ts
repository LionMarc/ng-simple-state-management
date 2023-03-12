export enum FilterType {
  and = 'And',
  or = 'Or',
  fieldCondition = 'FieldCondition'
}

export interface Filter {
  type: FilterType;
  field?: string;
  operator?: string;
  value?: any;
  children?: Filter[];
}

export const getFilterLabel = (filter: Filter): string => {
  switch (filter.type) {
    case FilterType.and:
    case FilterType.or:
      return filter.type;

    default:
      return '';
  }
};

export const getFilterDescription = (filter: Filter): string => {
  switch (filter.type) {
    case FilterType.fieldCondition:
      return `<div class="flex-row-center">
      ${filter.field} 
      <span class="filter-field-condition-operator">${filter.operator}</span> 
      ${filter.value}
      </div>`;

    default:
      return '';
  }
};
