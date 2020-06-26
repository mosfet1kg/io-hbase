import * as versionServices from './versionServices';
import * as statusServices from './statusServices';
import Table from './Table';
import * as url from 'url';
export * from './interfaces';
import {
  IHbase,
  IClientConstructorInput,
  ITableNameInput,
  IVersion,
  IStatus,
} from './interfaces';

import {
  get,
  isFunction,
  isNull,
} from 'lodash';

export class Hbase implements IHbase {
  private host: string;
  private port: string | number;
  private namespace: string;

  constructor(
    input?: IClientConstructorInput,
  ) {
    const { host = 'localhost', port = 8080, namespace = null } = input || {};

    this.host = isNull(url.parse(host).protocol) ? 'http://' + host : host;
    this.port = port;
    this.namespace = namespace;
  }

  private getEndPoint(): string {
    return `${ this.host }:${ this.port }`;
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
export function createClient( input?: IClientConstructorInput ): IHbase {
  return new Hbase(input);
}
