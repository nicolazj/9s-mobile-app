import { Dimensions, PixelRatio } from 'react-native';
let { width, height } = Dimensions.get('window');
if (width > height) {
  width = height;
}

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 680;

const scale = (size: number) => PixelRatio.roundToNearestPixel((width / guidelineBaseWidth) * size);
const verticalScale = (size: number) => PixelRatio.roundToNearestPixel((height / guidelineBaseHeight) * size);
const moderateScale = (size: number, factor = 0.5) =>
  PixelRatio.roundToNearestPixel(size + (scale(size) - size) * factor);

export { scale, verticalScale, moderateScale };
