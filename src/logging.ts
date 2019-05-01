import axios from 'axios';

const endpoint = 'https://enc5m7wqlpp1i.x.pipedream.net';
export default function log(...params: any[]) {
  __DEV__ && console.log(...params);
  axios.post(endpoint, { data: params });
}
