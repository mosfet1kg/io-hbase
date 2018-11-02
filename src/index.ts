import * as tableFn from './table';
import {
  get,
  isFunction,
} from 'lodash';

export default class Hbase implements IHbase {
  private host: string;
  private port: string | number;
  private namespace: string;
  private tableName: string;

  constructor(
    input?: IClientConstructorInput,
  ) {
    const { host = 'localhost', port = 8080, namespace = null } = input || {};

    this.host = host;
    this.port = port;
    this.namespace = namespace;
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
}
