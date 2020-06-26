export interface IHbase {
  table: (input?: ITableNameInput) => ITable;
  version: () => IVersion;
  status: () => IStatus;
}

export interface IClientConstructorInput {
  host: string;
  port: string | number;
  namespace?: string;
}

export interface ITableConstructorInput {
  host: string;
  port: string | number;
  namespace?: string;
  table?: string;
}

export interface ITableNameInput {
  table?: string;
}

export interface ITableCreateInput {
  ColumnSchema: IColumnSchema[];
}

export interface ITableFindAllOut {
  table: { name: string; }[];
}

export interface ITableUpdateInput {
  ColumnSchema: IColumnSchema[];
}

export interface ITableSchemaOut {
  name: string; // TableName
  ColumnSchema: IColumnSchema[];
  IS_META: boolean;
}

export interface ITableRegionOut {
  name: string; // TableName
  Region: {
    id: number
    startKey: string;
    endKey: string;
    location: string;
    name: string;
  }[];
}

export interface IColumnSchema {
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

export interface ITable {
  findAll: () => Promise<ITableFindAllOut>;
  create: (input: ITableCreateInput) => Promise<void>;
  drop: () => Promise<void>;
  exists: () => Promise<boolean>;
  update: (input: ITableUpdateInput) => Promise<void>;
  schema: () => Promise<ITableSchemaOut>;
  region: () => Promise<ITableRegionOut>;
  row: (input: IRowInput) => IRowFn;
  scan: (input: IScannerInput) => Promise<any>;
}

export interface IVersion {
  cluster: () => Promise<string>;
}

export interface IStatus {
  cluster: () => Promise<IStatusClusterResponse>;
}

export interface ICell {
  column: string;
  timestamp: number;
  $: string;
}

export interface IRowInput {
  key: string;
}

export interface IRow {
  key: string;
  Cell: ICell[];
}

export interface IRowResponse {
  Row: IRow[];
}

export interface INumOfVersions {
  v: number;
}

export interface IStatusClusterResponse {
  regions: number;
  requests: number;
  averageLoad: number;
  LiveNodes: LiveNode[];
  DeadNodes: any[];
}

export interface LiveNode {
  name: string;
  startCode: number;
  requests: number;
  heapSizeMB: number;
  maxHeapSizeMB: number;
  Region: Region[];
}

export interface Region {
  name: string;
  stores: number;
  storefiles: number;
  storefileSizeMB: number;
  memstoreSizeMB: number;
  storefileIndexSizeMB: number;
  readRequestsCount: number;
  writeRequestsCount: number;
  rootIndexSizeKB: number;
  totalStaticIndexSizeKB: number;
  totalStaticBloomSizeKB: number;
  totalCompactingKVs: number;
  currentCompactedKVs: number;
}

export interface ITimeStamp {
  startTime?: number;
  endTime?: number;
  timestamp?: number;
}

export interface IRowFn {
  put: (cells: ICell[]) => Promise<void>;
  timestamp: (input: ITimeStamp) => IRowFn;
  column: (input: { column: string; qualifier?: string; }) => IRowFn;
  get: (input?: INumOfVersions) => Promise<IRowResponse>;
  delete: () => Promise<void>;
}

export interface IScannerInput {
  batch?: number;
  cacheBlocks?: boolean;
  encoding?: string;
  startRow?: string;
  endRow?: string;
  startTime?: number;
  endTime?: number;
  maxVersions?: number;
  column?: string[] | string;
  filter?: IFilter | string;
}

export interface IFilter {
  type: string;
  value?: string;
  op?: string;
  comparator?: {
    type?: string;
    value?: string
  };
}
