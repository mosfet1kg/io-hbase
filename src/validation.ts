import { pick } from 'lodash';

export function getValidColumnOnly(
  {
    ColumnSchema,
  }: {
    ColumnSchema: InterfaceColumnSchema[];
  },
): InterfaceColumnSchema[] {
  return ColumnSchema.map(col => (
      pick(col,
        ['name',
          'BLOOMFILTER',
          'VERSIONS',
          'IN_MEMORY',
          'KEEP_DELETED_CELLS',
          'DATA_BLOCK_ENCODING',
          'TTL',
          'COMPRESSION',
          'COMPRESSION',
          'MIN_VERSIONS',
          'BLOCKCACHE',
          'BLOCKSIZE',
          'REPLICATION_SCOPE',
        ],
      )
    ),
  );
}
