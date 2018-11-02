import axios from "axios";
import {
  get,
  pick,
  isNumber,
  isUndefined,
} from 'lodash';
import { getValidColumnOnly } from './validation';
import {
  joinUrl,
  encodeBase64Str,
  decodeRowResponse,
} from './utils';

export function findAll()
  : Promise<ITableFindAllOut> {
  return axios
    .get(this.getEndPoint())
    .then(res => res.data);
}

export function create({ ColumnSchema }: ITableCreateInput )
  : Promise<any>  {
  if ( ! ColumnSchema.every(col => (col.name.indexOf(':') < 0)) ) {
    throw new Error('Column name cannot contain \':\'');
  }

  return axios({
    method: 'PUT',
    baseURL: this.getEndPoint(),
    url: joinUrl(this.getTableName(), 'schema'),
    data: {
      ColumnSchema: getValidColumnOnly({ ColumnSchema }),
    },
  }).then(res => res.data);
}

export function drop() {
  return axios({
    method: 'DELETE',
    baseURL: this.getEndPoint(),
    url: joinUrl(this.getTableName(), 'schema'),
  }).then(res => res.data);
}

export function exists() {
  return axios({
    method: 'GET',
    baseURL: this.getEndPoint(),
    url: joinUrl(this.getTableName(), 'exists'),
  }).then(res => true)
    .catch((error) => {
      if ( get(error, 'response.status') === 404 ) {
        return false;
      } // end if

      throw error;
    });
}

export function update({ ColumnSchema }: ITableUpdateInput) {
  return axios({
    method: 'POST',
    baseURL: this.getEndPoint(),
    url: joinUrl(this.getTableName(), 'schema'),
    data: {
      ColumnSchema: getValidColumnOnly({ ColumnSchema }),
    },
  }).then(res => res.data);
}

export function schema()
  : Promise<ITableSchemaOut> {
  return axios({
    method: 'GET',
    baseURL: this.getEndPoint(),
    url: joinUrl(this.getTableName(), 'schema'),
  }).then(res => res.data);
}

export function region()
  : Promise<ITableRegionOut> {
  return axios({
    method: 'GET',
    baseURL: this.getEndPoint(),
    url: joinUrl(this.getTableName(), 'regions'),
  }).then(res => res.data);
}

export function row({ key }) {
  return {
    put: (cells: ICell[]) => {
      const element = {
        key: encodeBase64Str(key),
        Cell: [],
      };

      element.Cell = cells.map(cell => (
        {
          timestamp: cell.timestamp || Date.now(),
          column: encodeBase64Str(cell.column),
          $: encodeBase64Str(cell.$),
        }
      ));

      return axios({
        method: 'PUT',
        baseURL: this.getEndPoint(),
        url: joinUrl(this.getTableName(), key),
        data: {
          Row: [element],
        },
      }).then(res => res.data);
    },
    timestamp: (input: { timestamp: number }) => {
      this.timeStamp = input.timestamp;
      return row.bind(this)({ key });
    },
    column: (input: { column: string; qualifier?: string; }) => {
      this.columnQualifier = input.column;

      if ( input.qualifier ) {
        this.columnQualifier += ':' + input.qualifier;
      } // end if

      return row.bind(this)({ key });
    },
    get: (input?: INumOfVersions): Promise<IRowResponse> => {
      let versionQueryString = '';

      if ( !isUndefined(get(input, 'v')) && isNumber(get(input, 'v')) ) {
        versionQueryString = `?v=${input.v}`;
      } // end if

      return axios({
        method: 'GET',
        baseURL: this.getEndPoint(),
        url: joinUrl(this.getTableName(), key, this.columnQualifier) + versionQueryString,
      }).then(res => decodeRowResponse(res.data));
    },
  };
}
