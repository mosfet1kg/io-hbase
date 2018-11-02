interface IHbase {
  table: (input: ITableNameInput) => ITableFn;
}

interface IClientConstructorInput {
  host: string;
  port: string | number;
  namespace?: string;
}

interface ITableNameInput {
  table?: string;
}

interface ITableCreateInput {
  ColumnSchema: InterfaceColumnSchema[];
}

interface ITableFindAllOut {
  table: { name: string; }[];
}

interface ITableUpdateInput {
  ColumnSchema: InterfaceColumnSchema[];
}

interface ITableSchemaOut {
  name: string; // TableName
  ColumnSchema: InterfaceColumnSchema[];
  IS_META: boolean;
}

interface ITableRegionOut {
  name: string; // TableName
  Region: {
    id: number
    startKey: string;
    endKey: string;
    location: string;
    name: string;
  }[];
}

interface InterfaceColumnSchema {
  name: string;
  BLOOMFILTER?: string;
  VERSIONS?: string;
  IN_MEMORY?: string;
  KEEP_DELETED_CELLS?: string;
  DATA_BLOCK_ENCODING?: string;
  TTL?: string | number;
  COMPRESSION?: string;
  MIN_VERSIONS?: string;
  BLOCKCACHE?: string;
  BLOCKSIZE?: string;
  REPLICATION_SCOPE?: string | number;
// { name: 'world',
//   BLOOMFILTER: 'ROW',
//   VERSIONS: '1',
//   IN_MEMORY: 'false',
//   KEEP_DELETED_CELLS: 'FALSE',
//   DATA_BLOCK_ENCODING: 'NONE',
//   TTL: '500',
//   COMPRESSION: 'NONE',
//   MIN_VERSIONS: '0',
//   BLOCKCACHE: 'true',
//   BLOCKSIZE: '65536',
//   REPLICATION_SCOPE: '0' }
}

interface ITableFn {
  findAll: () => Promise<ITableFindAllOut>;
  create: (input: ITableCreateInput) => Promise<any>;
  drop: () => Promise<any>;
  exists: () => Promise<boolean>;
  update: (input: ITableUpdateInput) => Promise<any>;
  schema: () => Promise<ITableSchemaOut>;
  region: () => Promise<ITableRegionOut>;
  row: (input: IRowInput) => any;
}

interface ICell {
  column: string;
  timestamp: number;
  $: string;
}

interface IRowInput {
  key: string;
}

interface IRow {
  key: string;
  Cell: ICell[];
}

interface IRowResponse {
  Row: IRow[];
}

interface INumOfVersions {
  v: number;
}
