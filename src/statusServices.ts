import axios from 'axios';
import { joinUrl } from './utils';

export function cluster(): Promise<IStatusClusterResponse> {
  return axios({
    method: 'GET',
    baseURL: this.getEndPoint(),
    url: joinUrl('status', 'cluster'),
  }).then(res => res.data);
}
