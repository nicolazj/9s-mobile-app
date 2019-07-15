import get from 'lodash.get';
import { Dimensions, PixelRatio } from 'react-native';
import * as styledComponents from 'styled-components/native';

export interface IThemeInterface {
  color: {
    main: string;
    header: string;
    grey: string;
    danger: string;
    view: { bg: string };
    chart: string[];
  };
}

const {
  default: styled,
  css,
  ThemeProvider,
  withTheme,
} = styledComponents as styledComponents.ReactNativeThemedStyledComponentsModule<
  IThemeInterface
>;

export const th = (...props: string[]) => ({
  theme,
}: {
  theme: IThemeInterface;
}) => {
  for (const prop of props) {
    const res = get(theme, prop);
    if (res) {
      return res;
    }
  }
};

export default styled;
export { css, ThemeProvider, withTheme };

export const scale = (size: number) => {
  const { width, height } = Dimensions.get('window');

  const length = width > height ? height : width;

  const guidelineBaseWidth = 375;

  return PixelRatio.roundToNearestPixel((length / guidelineBaseWidth) * size);
};
