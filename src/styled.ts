import * as styledComponents from 'styled-components';
import get from 'lodash.get';
const {
  default: styled,
  css,
  keyframes,
  ThemeProvider,
} = styledComponents as styledComponents.ThemedStyledComponentsModule<IThemeInterface>;

export interface IThemeInterface {
  color: {
    main: string;
  };
}

export const th = (...props: string[]) => ({ theme }: { theme: IThemeInterface }) => {
  for (let i = 0; i < props.length; i++) {
    let res = get(theme, props[i]);
    if (res) return res;
  }
};

export default styled;
export { css, keyframes, ThemeProvider };
