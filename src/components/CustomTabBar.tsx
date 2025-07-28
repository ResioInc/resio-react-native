import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const TAB_BAR_HEIGHT = 49;
const DOT_SIZE = 5;

export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const dotPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const tabWidth = 100 / state.routes.length;
    const toValue = state.index * tabWidth + tabWidth / 2 - DOT_SIZE / 2;
    
    Animated.spring(dotPosition, {
      toValue,
      useNativeDriver: false,
      tension: 68,
      friction: 10,
    }).start();
  }, [state.index]);

  const getIconName = (routeName: string, isFocused: boolean): string => {
    switch (routeName) {
      case 'Home':
        return isFocused ? 'home' : 'home-outline';
      case 'Payments':
        return isFocused ? 'card' : 'card-outline';
      case 'Maintenance':
        return isFocused ? 'construct' : 'construct-outline';
      case 'Messages':
        return isFocused ? 'chatbubble' : 'chatbubble-outline';
      case 'Profile':
        return isFocused ? 'person' : 'person-outline';
      default:
        return 'help-circle-outline';
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabBar}>
        {/* Shadow */}
        <View style={styles.shadowLine} />
        
        {/* Tab Items */}
        <View style={styles.tabItems}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            const iconName = getIconName(route.name, isFocused);
            const iconColor = isFocused ? '#000000' : '#8E8E93';

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tabItem}
              >
                <Icon name={iconName} size={24} color={iconColor} />
              </TouchableOpacity>
            );
          })}
        </View>
        
        {/* Animated Dot Indicator */}
        <Animated.View
          style={[
            styles.dotIndicator,
            {
              left: dotPosition.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  tabBar: {
    height: TAB_BAR_HEIGHT,
    backgroundColor: '#FFFFFF',
  },
  shadowLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 8,
  },
  tabItems: {
    flex: 1,
    flexDirection: 'row',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotIndicator: {
    position: 'absolute',
    bottom: 15,
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#000000',
  },
}); 