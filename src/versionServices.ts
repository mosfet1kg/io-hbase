import axios from "axios";
import { joinUrl } from "./utils";

export function cluster(): Promise<string> {
  return axios({
    method: 'GET',
    baseURL: this.getEndPoint(),
    url: joinUrl('version', 'cluster'),
  }).then(res => res.data);
}
