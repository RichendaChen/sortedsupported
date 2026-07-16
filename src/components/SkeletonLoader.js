import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const SkeletonLoader = ({ width = '100%', height = 18, borderRadius = 8, style }) => {
  const { isDark } = useTheme();
  const opacity = useRef(new Animated.Value(0.35)).current;
  const loopRef = useRef(null);

  useEffect(() => {
    loopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    loopRef.current.start();

    return () => {
      if (loopRef.current) {
        loopRef.current.stop();
      }
    };
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
          backgroundColor: isDark ? '#2A2A2A' : '#E5E5E5',
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
});

export default SkeletonLoader;
