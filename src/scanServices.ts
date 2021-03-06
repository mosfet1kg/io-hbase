import axios from "axios";
import {
  joinUrl,
  encodeBase64Str,
  decodeRowResponse,
  encodeFilterParam,
} from "./utils";
import {
  get,
  findIndex,
  isArray,
} from 'lodash';
import {
  IScannerInput,
  IRowResponse,
  IRow,
} from './interfaces';

export async function scan(input: IScannerInput = {}) {
  if ( get(input, 'filter') ) {
    input.filter = encodeFilterParam(input.filter);
    input.filter = JSON.stringify(input.filter);
  }

  if ( get(input, 'startRow') ) {
    input.startRow = encodeBase64Str(input.startRow);
  }

  if ( get(input, 'endRow') ) {
    input.endRow = encodeBase64Str(input.endRow);
  }

  if ( get(input, 'column') ) {
    if ( isArray(get(input, 'column')) ) {
      input.column = (input.column as string[]).map(el => encodeBase64Str(el));
    } else {
      input.column = encodeBase64Str((input as { column: string; }).column);
    }
  }

  const initScanner = (): Promise<string> => {
    return axios({
      method: 'PUT',
      baseURL: this.getEndPoint(),
      url: joinUrl(this.getTableName(), 'scanner'),
      data: input,
    }).then((res) => {
      const location = get(res, 'headers.location');
      const scannerId = /scanner\/(\w+)$/.exec(location)[1];

      return scannerId;
    });
  };

  const deleteScanner = ({ scannerId }): Promise<void> => {
    return axios({
      method: 'delete',
      baseURL: this.getEndPoint(),
      url: joinUrl(this.getTableName(), 'scanner', scannerId),
    }).then(res => res.data);
  };

  const getDataFromScanner = ({ scannerId }: { scannerId: string; }): Promise<
    {
      status: number;
      data: IRowResponse;
    }> => {
    return axios({
      method: 'get',
      baseURL: this.getEndPoint(),
      url: joinUrl(this.getTableName(), 'scanner', scannerId),
    });
  };

  let scannerId = null;

  try {
    scannerId = await initScanner();
    const out: { Row: IRow[] } = { Row: [] };
    // const start = Date.now();
    for ( ;; ) {
      const res = await getDataFromScanner({ scannerId });

      if ( res.status === 204 ) {
        break;
      }

      const responseRows = res.data.Row;

      out.Row = [...out.Row, ...responseRows];
      // for ( const resRow of responseRows ) {
      //   const idx = findIndex( out.Row, { key: resRow.key } );
      //   if ( idx === -1 ) {
      //     out.Row = [...out.Row, resRow];
        // } else {
        //   out.Row[idx].Cell = [...out.Row[idx].Cell, ...resRow.Cell];
        // } // end if
      // } // end loop
    } // end for loop
    await deleteScanner({ scannerId });

    return decodeRowResponse(out);
  } catch (e) {
    if ( scannerId ) {
      await deleteScanner({ scannerId });
    }
    throw e;
  }
}
