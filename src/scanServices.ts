import axios from "axios";
import { joinUrl } from "./utils";

export function scan() {
  return {
    init: () => {
      return axios({
        method: 'PUT',
        baseURL: this.getEndPoint(),
        url: joinUrl('content', 'scanner'),
        data: {
          Scanner: {
            batch: 1,
          },
        },
      }).then(res => res.data);
    },
  };
}
