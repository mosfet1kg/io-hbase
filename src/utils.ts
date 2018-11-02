export function joinUrl(...props) {
  return props.reduce((prev, curr) => {
    if ( !! curr ) {
      prev += '/' + encodeURIComponent(curr);
    }

    return prev;
  }, '');
}

export function decodeRowResponse(response: IRowResponse) {
  return {
    Row: response.Row.map((el) => {
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
  return  Buffer.from(str).toString('base64');
}
