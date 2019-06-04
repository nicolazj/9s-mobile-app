import axios from 'axios';
import { Constants } from 'expo';

//https://requestbin.com/r/enc5m7wqlpp1i
const endpoint = 'https://enc5m7wqlpp1i.x.pipedream.net';
let index = 0;
export default function log(...params: any[]) {
  __DEV__ && console.log(...params);
  axios.post(endpoint, {
    data: params,
    index: index++,
    version: Constants.manifest.version,
  });
}
