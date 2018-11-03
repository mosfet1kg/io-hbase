import * as versionServices from './versionServices';
import * as statusServices from './statusServices';
import Table from './Table';

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

  table(input?: ITableNameInput) {
    const tableName = get(input, 'table');

    return new Table({ table: tableName, host: this.host, port: this.port, namespace: this.namespace });
  }

  version() {
     return Object.keys(versionServices).reduce((prev, key) => {
      if ( isFunction(versionServices[key]) ) {
        prev = {
          ...prev,
          [key]: (...props) => versionServices[key].apply(this, props),
        };
      }
      return prev;
    }, {}) as IVersion;
  }

  status() {
    return Object.keys(statusServices).reduce((prev, key) => {
      if ( isFunction(statusServices[key]) ) {
        prev = {
          ...prev,
          [key]: (...props) => statusServices[key].apply(this, props),
        };
      }
      return prev;
    }, {}) as IStatus;
  }

}
