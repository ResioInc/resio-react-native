import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { WifiSupportType, WifiSupportOption } from '@/types';
import { COLORS, PADDING, ICON_SIZES } from '@/constants/homeConstants';

interface WifiSupportRowProps {
  option: WifiSupportOption;
  onPress: (type: WifiSupportType, value: string) => void;
}

export const WifiSupportRow: React.FC<WifiSupportRowProps> = ({
  option,
  onPress,
}) => {
  const handlePress = () => {
    onPress(option.type, option.value);
  };

  const getIconName = () => {
    switch (option.type) {
      case WifiSupportType.TEXT:
        return 'chatbubble-outline'; // iOS: .Icon.comment
      case WifiSupportType.EMAIL:
        return 'mail-outline'; // iOS: .Icon.mailOutline
      case WifiSupportType.WEBSITE:
        return 'globe-outline';
      default:
        return 'help-circle-outline';
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${option.title}: ${option.value}`}
      accessibilityHint={`Tap to ${option.type === WifiSupportType.TEXT ? 'send text message' : option.type === WifiSupportType.EMAIL ? 'send email' : 'open website'}`}
    >
      <View style={styles.iconContainer}>
        <Icon
          name={getIconName()}
          size={ICON_SIZES.medium}
          color={COLORS.textSubtitle}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{option.title}</Text>
        <Text style={styles.value}>{option.value}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PADDING.padding3, // iOS: iconBackground leading constant: .Padding.padding3
    paddingVertical: PADDING.padding4,
    minHeight: 60, // iOS: .Icon.background height
  },
  iconContainer: {
    width: 40, // iOS: .Icon.background
    height: 40, // iOS: .Icon.background
    borderRadius: 12, // iOS: .Icon.backgroundRadius
    backgroundColor: COLORS.iconBackground, // iOS: .Icon.outlineBackground
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: PADDING.padding3,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13, // iOS: .avenir400(withSize: 13)
    fontWeight: '400',
    color: COLORS.textSubtitle, // iOS: .Text.subtitle
    marginBottom: 2,
  },
  value: {
    fontSize: 15, // iOS: .avenir400(withSize: 15)
    fontWeight: '400',
    color: COLORS.textPrimary, // iOS: .Text.primary
  },
});