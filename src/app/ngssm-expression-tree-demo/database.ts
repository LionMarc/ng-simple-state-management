export type EntryType = 'Database' | 'Table' | 'Column';

export interface Entry {
  name: string;
  type: EntryType;
}

export interface Column extends Entry {
  dataType: string;
}

export interface Table extends Entry {
  columns: Column[];
}

export interface Database extends Entry {
  tables: Table[];
}

export const databases: Database[] = [
  {
    name: 'WSL',
    type: 'Database',
    tables: [
      {
        name: 'postgres',
        type: 'Table',
        columns: [
          {
            name: 'id',
            type: 'Column',
            dataType: 'INTEGER'
          },
          {
            name: 'name',
            type: 'Column',
            dataType: 'TEXT'
          }
        ]
      },
      {
        name: 'smusdi',
        type: 'Table',
        columns: [
          {
            name: 'id',
            type: 'Column',
            dataType: 'INTEGER'
          },
          {
            name: 'close',
            type: 'Column',
            dataType: 'DATE'
          },
          {
            name: 'type',
            type: 'Column',
            dataType: 'TEXT'
          }
        ]
      }
    ]
  },
  {
    name: 'Local',
    type: 'Database',
    tables: [
      {
        name: 'postgres',
        type: 'Table',
        columns: [
          {
            name: 'id',
            type: 'Column',
            dataType: 'INTEGER'
          },
          {
            name: 'name',
            type: 'Column',
            dataType: 'TEXT'
          }
        ]
      },
      {
        name: 'testing',
        type: 'Table',
        columns: [
          {
            name: 'id',
            type: 'Column',
            dataType: 'INTEGER'
          },
          {
            name: 'timestamp',
            type: 'Column',
            dataType: 'DATE'
          },
          {
            name: 'value',
            type: 'Column',
            dataType: 'REAL'
          }
        ]
      },
      {
        name: 'results',
        type: 'Table',
        columns: [
          {
            name: 'id',
            type: 'Column',
            dataType: 'INTEGER'
          },
          {
            name: 'timestamp',
            type: 'Column',
            dataType: 'DATE'
          },
          {
            name: 'ok',
            type: 'Column',
            dataType: 'INTEGER'
          }
        ]
      }
    ]
  }
];
