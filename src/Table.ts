import * as tableServices from './tableServices';
import { row as rowServices } from './rowServices';
import { scan as scanServices } from './scanServices';
import {
  get,
  isFunction,
  isUndefined,
  isNull,
} from 'lodash';

export default class Table implements ITable {
  private host: string;
  private port: string | number;
  private namespace: string;
  private tableName: string;
  private startTime: number;
  private endTime: number;
  private columnQualifier: string;

  constructor(
    input?: ITableConstructorInput,
  ) {
    const { host = 'localhost', port = 8080, namespace = null } = input || {};

    this.host = host;
    this.port = port;
    this.namespace = namespace;
    this.tableName = get(input, 'table');
  }

  private getTimeRange() {
    const range = [this.startTime, this.endTime].filter(el => !isNull(el) && !isUndefined(el));

    return range.length === 0 ? '' : '/' + range.join(',');
  }

  private getEndPoint(): string {
    return `http://${ this.host }:${ this.port }`;
  }

  private getTableName() {
    if ( this.namespace ) {
      return this.namespace + ':' + this.tableName;
    }

    return this.tableName;
  }

  findAll(...props) {
    return tableServices.findAll.apply(this, props);
  }

  create(...props) {
    return tableServices.create.apply(this, props);
  }

  drop(...props) {
    return tableServices.drop.apply(this, props);
  }

  exists(...props) {
    return tableServices.exists.apply(this, props);
  }

  update(...props) {
    return tableServices.update.apply(this, props);
  }

  schema(...props) {
    return tableServices.schema.apply(this, props);
  }

  region(...props) {
    return tableServices.region.apply(this, props);
  }

  row(...props) {
    return rowServices.apply(this, props);
  }

  scan(...props) {
    return scanServices.apply(this, props);
  }
}
