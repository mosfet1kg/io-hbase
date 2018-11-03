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
} from './utils';
import rowServices from "./rowServices";

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

export function row(...props) {
  return rowServices.apply(this, props);
}
