import { useRef } from 'react';
import { Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  MIN_HEADER_HEIGHT,
  BEGIN_ANIMATION_HEIGHT,
  PLACEHOLDER_HEIGHT,
  CARD_OVERLAY_HEIGHT,
  ANIMATION,
} from '@/constants/homeConstants';
import { HeaderAnimationValues } from '@/types/home';

export const useHeaderAnimation = (): {
  scrollY: Animated.Value;
  animations: HeaderAnimationValues;
  maxHeaderHeight: number;
  minHeight: number;
} => {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  // Header animation calculations (matching iOS exactly)
  const maxHeaderHeight = PLACEHOLDER_HEIGHT + CARD_OVERLAY_HEIGHT + BEGIN_ANIMATION_HEIGHT;
  const minHeight = MIN_HEADER_HEIGHT + insets.top;

  // iOS logic: finalHeight = refHeaderHeight - yOffset
  // When pulling down (negative scroll), header grows larger
  const headerHeight = scrollY.interpolate({
    inputRange: [-ANIMATION.pullDownRange, 0, maxHeaderHeight - minHeight],
    outputRange: [
      maxHeaderHeight + ANIMATION.pullDownRange,
      maxHeaderHeight,
      minHeight,
    ],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, (maxHeaderHeight - minHeight) / 2],
    outputRange: [0.8, 0.2],
    extrapolate: 'clamp',
  });

  const shadowOpacity = scrollY.interpolate({
    inputRange: [0, maxHeaderHeight - minHeight],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Image zoom effect when pulling down (matching iOS)
  const imageScale = scrollY.interpolate({
    inputRange: [-ANIMATION.pullDownRange, 0],
    outputRange: [ANIMATION.scaleMax, 1],
    extrapolate: 'clamp',
  });

  return {
    scrollY,
    animations: {
      headerHeight,
      headerOpacity,
      shadowOpacity,
      imageScale,
    },
    maxHeaderHeight,
    minHeight,
  };
};