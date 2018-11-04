import {
  get,
  isArray,
} from 'lodash';

export function joinUrl(...props) {
  return props.reduce((prev, curr) => {
    if ( !! curr ) {
      prev += '/' + encodeURIComponent(curr);
    }

    return prev;
  }, '');
}

export function decodeRowResponse(response: IRowResponse) {
  const row = get(response, 'Row', []);

  return {
    Row: row.map((el) => {
      const {
        key,
        Cell,
      } = el;

      return {
        key: decodeBase64Str(key),
        Cell: Cell.map(({ column, timestamp, $ }) => ({
            column: decodeBase64Str(column),
            timestamp,
            $: decodeBase64Str($),
          }),
        ),
      };
    }),
  };
}

export function decodeBase64Str(str: string) {
  return Buffer.from(str, 'base64').toString('ascii');
}

export function encodeBase64Str(str: string) {
  return Buffer.from(str).toString('base64');
}

export function encodeFilterParam(filter: any) {
  const type = get(filter, 'type');

  if ( [
    'ColumnPrefixFilter',
    'ColumnRangeFilter',
    'InclusiveStopFilter',
    'MultipleColumnPrefixFilter',
    'PrefixFilter',
  ].includes(type) ) {
    if ( get(filter, 'value') ) {
      filter.value = encodeBase64Str(filter.value);
    }

    /** ColumnRangeFilter **/
    if ( get(filter, 'minColumn') ) {
      filter.minColumn = encodeBase64Str(filter.minColumn);
    }

    if ( get(filter, 'maxColumn') ) {
      filter.maxColumn = encodeBase64Str(filter.maxColumn);
    }

    /** MultipleColumnPrefixFilter **/
    if ( get(filter, 'prefixes') ) {
      filter.fixes = filter.fixes.map(el => encodeBase64Str(el));
    }

  }

  if ( get(filter, 'comparator') !== undefined ) {
    // if ( [
    // 'BinaryComparator',
    // 'RegexStringComparator',
    // ].includes(get(filter, 'comparator.type')) ) {
    (filter as IFilter).comparator.value
      = encodeBase64Str((filter as IFilter).comparator.value);
    // }
  }

  /** MUST_PASS_ALL **/
  if ( type === 'FilterList' && get(filter, 'filterList') && isArray(get(filter, 'filterList')) ) {
    filter.filters = filter.filters.map(el => encodeFilterParam(el));
  }

  return filter;
}
