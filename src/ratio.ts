import { Dimensions, PixelRatio } from 'react-native';
const DESIGN_WIDTH = 375;

let { height, width } = Dimensions.get('window');
if (width > height) {
  width = height;
}

const ratio = width / DESIGN_WIDTH;

export const r = (size: number) => PixelRatio.roundToNearestPixel(size * ratio);
