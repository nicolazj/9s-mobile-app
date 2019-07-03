import React from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from 'react-native';
import _debounce from 'lodash.debounce';
import PaginationIndicator from './PaginationIndicator';

const { width } = Dimensions.get('window');

const interval = 5000;

const Walkthrough: React.FC = ({ children }) => {
  const [index, setIndex] = React.useState(0);
  const timer = React.useRef<number>();
  const touched = React.useRef<boolean>(false);
  const list = React.useRef<FlatList<any>>(null);
  const len = React.Children.count(children);

  const extractItemKey = (_: any, index: number) => index.toString();

  const renderItem = ({
    item,
    index: index_,
  }: {
    item: React.ReactElement<any>;
    index: number;
  }) => (
    <View style={[{ flex: 1, width }]}>
      {React.cloneElement(item, { current: index_ === index })}
    </View>
  );

  const onScroll = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, layoutMeasurement } = e.nativeEvent;
      const pageNum = Math.floor(contentOffset.x / layoutMeasurement.width);
      debouncedSetIndex(pageNum);
    },
    []
  );

  const debouncedSetIndex = React.useCallback(
    _debounce((pageNum: number) => {
      setIndex(pageNum);
    }, 500),
    []
  );

  const onTouchStart = () => {
    clearTimeout(timer.current!);
    touched.current = true;
  };
  React.useEffect(() => {
    if (index < len - 1 && !touched.current) {
      timer.current = (setTimeout(() => {
        if (list.current) {
          list.current.scrollToOffset({ offset: width * (index + 1) });
          setIndex(index + 1);
        }
      }, interval) as unknown) as number;
    }
  }, [index]);

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <FlatList
        ref={list}
        style={{ flex: 1, backgroundColor: '#fff', width: '100%' }}
        data={React.Children.toArray(children)}
        onScroll={onScroll}
        onTouchStart={onTouchStart}
        keyExtractor={extractItemKey}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        directionalLockEnabled
        renderItem={renderItem}
      />
      <PaginationIndicator length={len} current={index} />
    </View>
  );
};
export default Walkthrough;
