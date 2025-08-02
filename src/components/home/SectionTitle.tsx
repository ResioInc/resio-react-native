import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS, PADDING, TYPOGRAPHY } from '@/constants/homeConstants';

interface SectionTitleProps {
  title: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => {
  return (
    <Text style={styles.title} accessibilityRole="header">
      {title}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    ...TYPOGRAPHY.sectionTitle,
    color: COLORS.textPrimary,
    marginBottom: PADDING.padding4,
    // Removed paddingHorizontal - let parent containers handle padding
  },
});