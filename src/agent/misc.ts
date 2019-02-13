import axios from 'axios';
import { WidgetSample } from '../types';
export default () => {
  return {
    widget: {
      sample: async () => {
        const r = await axios.get<WidgetSample[]>('https://cdn.9spokes.io/marketplace_widgets.json');
        return r.data;
      },
    },
  };
};
