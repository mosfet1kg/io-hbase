import {
  decodeRowResponse,
  encodeBase64Str,
  joinUrl,
} from "./utils";
import axios from "axios";
import {
  isNumber,
  isUndefined,
  isNull,
  get,
} from "lodash";

export default function row({ key }) {
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
    timestamp: (input: ITimeStamp) => {
      if ( !isUndefined(input.timestamp) && ( !isUndefined(input.startTime) || !isUndefined(input.endTime)) ) {
        throw new Error(`timestamp cannot be used with startTime and end Time.`);
      }

      if ( isUndefined(input.endTime) && !isUndefined(input.startTime) ) {
        throw new Error(`If start-timestamp is set, end-timestamp also must be defined.`);
      }

      this.startTime = input.startTime;
      this.endTime = input.endTime;

      if ( !isUndefined(input.timestamp) ) {
        this.endTime = input.timestamp;
      }

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
        url: joinUrl(this.getTableName(), key, this.columnQualifier) + this.getTimeRange() + versionQueryString,
      }).then(res => decodeRowResponse(res.data));
    },
    delete: (): Promise<void> => {
      return axios({
        method: 'DELETE',
        baseURL: this.getEndPoint(),
        url: joinUrl(this.getTableName(), key, this.columnQualifier) + this.getTimeRange(),
      }).then(res => res.data);
    },
  };
}
