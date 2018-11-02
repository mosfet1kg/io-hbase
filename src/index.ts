import * as tableFn from './table';
import * as versionFn from './version';
import * as statusFn from './status';
import {
  get,
  isFunction,
  isUndefined,
  isNull,
} from 'lodash';

export default class Hbase implements IHbase {
  private host: string;
  private port: string | number;
  private namespace: string;
  private tableName: string;
  private startTime: number;
  private endTime: number;
  private columnQualifier: string;

  constructor(
    input?: IClientConstructorInput,
  ) {
    const { host = 'localhost', port = 8080, namespace = null } = input || {};

    this.host = host;
    this.port = port;
    this.namespace = namespace;
  }

  private clearTempParams() {
    this.columnQualifier = null;
    this.startTime =  null;
    this.endTime = null;
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

  table(input?: ITableNameInput) {
    this.tableName = get(input, 'table');
    this.clearTempParams();

    return Object.keys(tableFn).reduce((prev, key) => {
      if ( isFunction(tableFn[key]) ) {
        prev = {
          ...prev,
          [key]: (...props) => tableFn[key].apply(this, props),
        };
      }
      return prev;
    }, {}) as ITableFn;
  }

  version() {
     return Object.keys(versionFn).reduce((prev, key) => {
      if ( isFunction(versionFn[key]) ) {
        prev = {
          ...prev,
          [key]: (...props) => versionFn[key].apply(this, props),
        };
      }
      return prev;
    }, {}) as IVersionFn;
  }

  status() {
    return Object.keys(statusFn).reduce((prev, key) => {
      if ( isFunction(statusFn[key]) ) {
        prev = {
          ...prev,
          [key]: (...props) => statusFn[key].apply(this, props),
        };
      }
      return prev;
    }, {}) as IStatusFn;
  }

}
