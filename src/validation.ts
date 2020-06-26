import { pick } from 'lodash';
import {
  IColumnSchema,
} from './interfaces';

export function getValidColumnOnly(
  {
    ColumnSchema,
  }: {
    ColumnSchema: IColumnSchema[];
  },
): IColumnSchema[] {
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
