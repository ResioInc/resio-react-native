import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { File } from '@/types';
import {  PADDING } from '@/constants/homeConstants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ImageCarouselProps {
  files: File[];
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ files }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter to only image files (matching iOS logic)
  const imageFiles = files.filter(file => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'heic'];
    const fileExtension = file.label.split('.').pop()?.toLowerCase();
    return fileExtension && imageExtensions.includes(fileExtension);
  });

  if (imageFiles.length === 0) {
    return null;
  }

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {imageFiles.map((file, index) => (
                  <Image
          key={file.id}
          source={{ uri: file.fileUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        ))}
      </ScrollView>
      
      {/* Page Indicator - Only show if multiple images */}
      {imageFiles.length > 1 && (
        <View style={styles.pageIndicatorContainer}>
          {imageFiles.map((_, index) => (
            <View
              key={index}
              style={[
                styles.pageIndicator,
                index === currentIndex && styles.activePageIndicator
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SCREEN_WIDTH * (2 / 3), // iOS: 2/3 aspect ratio
    width: SCREEN_WIDTH,
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  pageIndicatorContainer: {
    position: 'absolute',
    bottom: PADDING.padding4,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: PADDING.padding1,
  },
  pageIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activePageIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});