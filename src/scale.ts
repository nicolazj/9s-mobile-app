import { Dimensions, PixelRatio } from 'react-native';
const { width, height } = Dimensions.get('window');

const length = width > height ? height : width;

const guidelineBaseWidth = 375;

const scale = (size: number) => PixelRatio.roundToNearestPixel((length / guidelineBaseWidth) * size);
const moderateScale = (size: number, factor = 0.5) =>
  PixelRatio.roundToNearestPixel(size + (scale(size) - size) * factor);

export { scale, moderateScale };
