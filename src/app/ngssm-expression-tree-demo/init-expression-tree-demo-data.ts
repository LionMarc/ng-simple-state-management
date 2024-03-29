import { DateTime } from 'luxon';
import { NgssmNode } from 'ngssm-tree';
import { Filter, FilterType } from './filter';

export const initialExpression: Filter[] = [
  {
    type: FilterType.and,
    children: [
      {
        type: FilterType.fieldCondition,
        field: 'price',
        operator: 'lt',
        value: 45.67
      },
      {
        type: FilterType.fieldCondition,
        field: 'price',
        operator: 'gt',
        value: 22.4
      },
      {
        type: FilterType.or,
        children: [
          {
            type: FilterType.fieldCondition,
            field: 'status',
            operator: 'eq',
            value: 'valid'
          },
          {
            type: FilterType.and,
            children: [
              {
                type: FilterType.fieldCondition,
                field: 'comment',
                operator: 'contains',
                value: 'forced'
              },
              {
                type: FilterType.fieldCondition,
                field: 'creationDate',
                operator: 'lt',
                value: DateTime.fromSQL('2023-03-01')
              }
            ]
          },
          {
            type: FilterType.fieldCondition,
            field: 'state',
            operator: 'eq',
            value: 'open'
          }
        ]
      }
    ]
  }
];

export const demoTreeId = 'demo-expression-tree';

export const setNodesFromFilter = (filter: Filter, path: string[], nextId: number, nodes: NgssmNode<Filter>[]): number => {
  let currentId = nextId;
  nodes.push({
    id: nextId.toString(),
    parentId: path[path.length - 1],
    isExpandable: filter.type === FilterType.and || filter.type === FilterType.or,
    hasRowDetail: filter.type === FilterType.fieldCondition && DateTime.isDateTime(filter.value),
    data: {
      ...filter,
      children: undefined
    }
  });

  const currentPath: string[] = [...path, nextId.toString()];

  (filter.children ?? []).forEach((child) => {
    currentId = setNodesFromFilter(child, currentPath, currentId + 1, nodes);
  });

  return currentId;
};
