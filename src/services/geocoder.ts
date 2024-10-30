import NodeGeocoder from 'node-geocoder';
import { MAPBOX_API_KEY } from '../config/config';

const options: NodeGeocoder.Options = {
  provider: 'mapbox',
  apiKey: MAPBOX_API_KEY,
};

const geocoder = NodeGeocoder(options);

export default geocoder;
