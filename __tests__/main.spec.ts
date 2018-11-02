import 'source-map-support/register';
import Hbase from '../src';
import {
  findIndex,
} from 'lodash';

describe('greeter function', () => {

  beforeAll(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  });

  it('test findAll', async (done) => {
    try {
      const hbaseClient = new Hbase({
        host: 'localhost',
        port: 8080,
      });

      const allTableList = await hbaseClient
        .table()
        .findAll();

      console.log( allTableList );

      done();
    } catch (e) {
      console.log( e );
      done.fail(e);
    }
  });

  it('test createTable', async (done) => {
    try {
      const hbaseClient = new Hbase({
        host: 'localhost',
        port: 8080,
      });

      const table = 'my-table';

      await hbaseClient
        .table({ table })
        .create(
          {
            ColumnSchema: [
              {
                name: 'my_column_family',
                TTL: 60 * 60 * 24 * 365 * 1,
                COMPRESSION: 'gz',
                REPLICATION_SCOPE: 1,
                VERSIONS: '5',
              },
            ],
          },
        );

      const res = await hbaseClient.table({ table })
        .schema();

      console.log( res );

      await hbaseClient.table({ table }).drop();

      done();
    } catch (e) {
      console.log( e );
      done.fail(e);
    }
  });

  it('test Destroy Table', async (done) => {
    try {
      const hbaseClient = new Hbase({
        host: 'localhost',
        port: 8080,
      });
      const table =  'my-table';
      const tableInfo =  {
        ColumnSchema: [
          {
            name: 'my_column_family',
            TTL: 60 * 60 * 24 * 365 * 1,
            COMPRESSION: 'gz',
            REPLICATION_SCOPE: 1,
          },
        ],
      };

      await hbaseClient.table({ table }).create(tableInfo);
      await hbaseClient.table({ table }).drop();

      const response = await hbaseClient
        .table({ table })
        .exists();

      expect(response).toEqual(false);

      done();
    } catch (e) {
      done.fail(e);
    } // end try ~ catch
  });

  it('test schema and update', async (done) => {
    try {
      const table = 'schema-test-table';

      const hbaseClient = new Hbase({
        host: 'localhost',
        port: 8080,
      });

      await hbaseClient
        .table({ table })
        .create(
          {
            ColumnSchema: [
              {
                name: 'my_column_family',
                TTL: 60 * 60 * 24 * 365 * 1,
                COMPRESSION: 'gz',
                REPLICATION_SCOPE: 1,
                VERSIONS: '5',
              },
            ],
          },
        );

      const res = await hbaseClient.table({ table }).schema();

      console.log( res );

      const {
        name,
        ColumnSchema,
      } = res;

      expect(name).toEqual(table);

      const idx = findIndex(ColumnSchema, { name: 'my_column_family' });

      expect(idx).not.toEqual(-1);
      expect(ColumnSchema[idx].TTL).toEqual((60 * 60 * 24 * 365 * 1).toString());
      expect(ColumnSchema[idx].COMPRESSION).toEqual('gz');
      expect(ColumnSchema[idx].REPLICATION_SCOPE).toEqual('1');
      expect(ColumnSchema[idx].VERSIONS).toEqual('5');

      await hbaseClient.table({ table }).drop();

      done();
    } catch (e) {
      done.fail(e);
    }
  });

  it('test region', async(done) => {
    try {
      const table = 'region-test-table';

      const hbaseClient = new Hbase({
        host: 'localhost',
        port: 8080,
      });

      await hbaseClient
        .table({ table })
        .create(
          {
            ColumnSchema: [
              {
                name: 'my_column_family',
                TTL: 60 * 60 * 24 * 365 * 1,
                COMPRESSION: 'gz',
                REPLICATION_SCOPE: 1,
              },
            ],
          },
        );

      const res = await hbaseClient.table({ table }).region();

      console.log( res );

      await hbaseClient.table({ table }).drop();

      done();
    } catch (e) {
      done.fail(e);
    }
  });

  it('test row', async(done) => {
    try {
      const hbaseClient = new Hbase({
        host: 'localhost',
        port: 8080,
      });

      const table = 'my-table';

      await hbaseClient
        .table({ table })
        .create(
          {
            ColumnSchema: [
              {
                name: 'my_column_family',
                TTL: 60 * 60 * 24 * 365 * 1,
                COMPRESSION: 'gz',
                REPLICATION_SCOPE: 1,
                VERSIONS: '5',
              },
            ],
          },
        );

      const cells = [
        { column: 'my_column_family:c1', timestamp: Date.now(), $: 'my value1' },
        { column: 'my_column_family:c2', timestamp: Date.now(), $: 'my value2' },
        { column: 'my_column_family:c3', timestamp: Date.now(), $: 'my value3' },
      ];

      await hbaseClient
        .table({ table })
        .row({ key: 'rowKey' })
        .put(cells);

      await hbaseClient.table({ table }).drop();

      done();
    } catch (e) {
      done.fail(e);
    }
  });

  it('test get single row with timestamp', async (done) => {
    try {
      const table = 'test-get-single-table';

      const hbaseClient = new Hbase({
        host: 'localhost',
        port: 8080,
      });

      await hbaseClient
        .table({ table })
        .create(
          {
            ColumnSchema: [
              {
                name: 'my_column_family',
                TTL: 60 * 60 * 24 * 365 * 1,
                COMPRESSION: 'gz',
                REPLICATION_SCOPE: 1,
                VERSIONS: '5',
              },
            ],
          },
        );

      const timestamp = Date.now();

      const cells = [
        { column: 'my_column_family:c1', timestamp, $: 'my value1' },
      ];

      await hbaseClient
        .table({ table })
        .row({ key: 'rowKey' })
        .put(cells);

      const res = await hbaseClient
        .table({ table })
        .row({ key: 'rowKey' })
        .column({ column: 'my_column_family:c1' })
        .timestamp({ timestamp })
        .get();

      expect(res.Row.length).toEqual(1);
      expect(res.Row[0].key).toEqual('rowKey');
      expect(res.Row[0].Cell[0].timestamp).toEqual(cells[0].timestamp);
      expect(res.Row[0].Cell[0].column).toEqual(cells[0].column);
      expect(res.Row[0].Cell[0].$).toEqual(cells[0].$);

      console.log( JSON.stringify(res) );

      await hbaseClient.table({ table }).drop();

      done();
    } catch (e) {
      done.fail(e);
    }
  });

  it('test get with rowKey Only', async (done) => {
    try {
      const table = 'test-get-rowKey-table';

      const hbaseClient = new Hbase({
        host: 'localhost',
        port: 8080,
      });

      await hbaseClient
        .table({ table })
        .create(
          {
            ColumnSchema: [
              {
                name: 'my_column_family',
                TTL: 60 * 60 * 24 * 365 * 1,
                COMPRESSION: 'gz',
                REPLICATION_SCOPE: 1,
                VERSIONS: '5',
              },
            ],
          },
        );

      const timestamp = Date.now();

      const cells = [
        { column: 'my_column_family:c1', timestamp, $: 'my value1' },
        { column: 'my_column_family:c2', timestamp, $: 'my value2' },
      ];

      await hbaseClient
        .table({ table })
        .row({ key: 'rowKey' })
        .put(cells);

      const res = await hbaseClient
        .table({ table })
        .row({ key: 'rowKey' })
        .get();

      expect(res.Row.length).toEqual(1);
      expect(res.Row[0].key).toEqual('rowKey');
      expect(res.Row[0].Cell.length).toEqual(2);
      expect(res.Row[0].Cell[0].timestamp).toEqual(cells[0].timestamp);
      expect(res.Row[0].Cell[0].column).toEqual(cells[0].column);
      expect(res.Row[0].Cell[0].$).toEqual(cells[0].$);

      expect(res.Row[0].Cell[1].timestamp).toEqual(cells[1].timestamp);
      expect(res.Row[0].Cell[1].column).toEqual(cells[1].column);
      expect(res.Row[0].Cell[1].$).toEqual(cells[1].$);

      console.log( JSON.stringify(res) );

      await hbaseClient.table({ table }).drop();

      done();
    } catch (e) {
      done.fail(e);
    }
  });

  it('test get multiple versions', async (done) => {
    const table = 'test-get-multiple-version-table';

    const hbaseClient = new Hbase({
      host: 'localhost',
      port: 8080,
    });

    try {
      await hbaseClient
        .table({ table })
        .create(
          {
            ColumnSchema: [
              {
                name: 'my_column_family',
                TTL: 60 * 60 * 24 * 365 * 1,
                COMPRESSION: 'gz',
                REPLICATION_SCOPE: 1,
                VERSIONS: '5',
              },
            ],
          },
        );

      const timestamp = Date.now();

      const cells = [
        { column: 'my_column_family:c1', timestamp, $: 'my value1' },
        { column: 'my_column_family:c1', timestamp: timestamp + 1000, $: 'my value2' },
        { column: 'my_column_family:c1', timestamp: timestamp + 2000, $: 'my value3' },
      ];

      await hbaseClient
        .table({ table })
        .row({ key: 'rowKey' })
        .put(cells);

      const res = await hbaseClient
        .table({ table })
        .row({ key: 'rowKey' })
        .get({ v: 2 });

      console.log( JSON.stringify(res) );

      expect(res.Row.length).toEqual(1);
      expect(res.Row[0].key).toEqual('rowKey');
      expect(res.Row[0].Cell.length).toEqual(2);
      expect(res.Row[0].Cell[0].timestamp).toEqual(cells[2].timestamp);
      expect(res.Row[0].Cell[0].column).toEqual(cells[2].column);
      expect(res.Row[0].Cell[0].$).toEqual(cells[2].$);

      expect(res.Row[0].Cell[1].timestamp).toEqual(cells[1].timestamp);
      expect(res.Row[0].Cell[1].column).toEqual(cells[1].column);
      expect(res.Row[0].Cell[1].$).toEqual(cells[1].$);

      await hbaseClient.table({ table }).drop();

      done();
    } catch (e) {
      await hbaseClient.table({ table }).drop();
      done.fail(e);
    }
  });

});
