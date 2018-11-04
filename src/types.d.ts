interface IHbase {
  table: (input: ITableNameInput) => ITable;
  version: () => IVersion;
  status: () => IStatus;
}

interface IClientConstructorInput {
  host: string;
  port: string | number;
  namespace?: string;
}

interface ITableConstructorInput {
  host: string;
  port: string | number;
  namespace?: string;
  table?: string;
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

interface ITable {
  findAll: () => Promise<ITableFindAllOut>;
  create: (input: ITableCreateInput) => Promise<void>;
  drop: () => Promise<void>;
  exists: () => Promise<boolean>;
  update: (input: ITableUpdateInput) => Promise<void>;
  schema: () => Promise<ITableSchemaOut>;
  region: () => Promise<ITableRegionOut>;
  row: (input: IRowInput) => IRowFn;
  scan: () => any;
}

interface IVersion {
  cluster: () => Promise<string>;
}

interface IStatus {
  cluster: () => Promise<IStatusClusterResponse>;
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

interface IStatusClusterResponse {
  regions: number;
  requests: number;
  averageLoad: number;
  LiveNodes: LiveNode[];
  DeadNodes: any[];
}

interface LiveNode {
  name: string;
  startCode: number;
  requests: number;
  heapSizeMB: number;
  maxHeapSizeMB: number;
  Region: Region[];
}

interface Region {
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

interface ITimeStamp {
  startTime?: number;
  endTime?: number;
  timestamp?: number;
}

interface IRowFn {
  put: (cells: ICell[]) => Promise<void>;
  timestamp: (input: ITimeStamp) => IRowFn;
  column: (input: { column: string; qualifier?: string; }) => IRowFn;
  get: (input?: INumOfVersions) => Promise<IRowResponse>;
  delete: () => Promise<void>;
}

interface IScannerInput {
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

interface IFilter {
  type: string;
  value?: string;
  op?: string;
  comparator?: {
    type?: string;
    value?: string
  };
}
