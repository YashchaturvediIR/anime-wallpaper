import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallScreen = SCREEN_WIDTH < 375;
const isLargeScreen = SCREEN_WIDTH > 414;

// Revised wallpaper positioning to ensure all are visible
const getWallpaperStyles = () => {
  const baseWidth = SCREEN_WIDTH * 0.35;
  const baseHeight = baseWidth * 1.4;

  const topOffset = SCREEN_HEIGHT * 0.1; 
  const verticalSpacing = SCREEN_HEIGHT * 0.05; // 5% vertical spacing between rows

  return [
    {
      id: 1,
      image: require('../assets/images/cat1.jpeg'),
      style: { 
        top: topOffset, 
        left: SCREEN_WIDTH * 0.1, 
        width: baseWidth, 
        height: baseHeight 
      },
    },
    {
      id: 2,
      image: require('../assets/images/cat2.jpeg'),
      style: { 
        top: topOffset, 
        right: SCREEN_WIDTH * 0.1, 
        width: baseWidth, 
        height: baseHeight 
      },
    },
    {
      id: 3,
      image: require('../assets/images/cat3.jpeg'),
      style: { 
        top: topOffset + baseHeight + verticalSpacing, // Pushed down to the next row
        left: SCREEN_WIDTH * 0.05, 
        width: baseWidth * 0.7, 
        height: baseHeight * 0.7 
      },
    },
    {
      id: 4,
      image: require('../assets/images/cat4.jpeg'),
      style: { 
        top: topOffset + baseHeight + verticalSpacing,
        left: SCREEN_WIDTH * 0.35, 
        width: baseWidth * 0.7, 
        height: baseHeight * 0.7 
      },
    },
    {
      id: 5,
      image: require('../assets/images/cat5.jpeg'),
      style: { 
        top: topOffset + baseHeight + verticalSpacing,
        right: SCREEN_WIDTH * 0.05, 
        width: baseWidth * 0.7, 
        height: baseHeight * 0.7 
      },
    },
  ];
};

export default function IndexScreen() {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const growAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(growAnim, {
        toValue: 1.2,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, rotateAnim, growAnim]);

  const handleStartExplore = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>Walls that Speak Anime</Text>
          <Animated.Image
            source={require("../assets/images/transparent.png")}
            style={[
              styles.trans,
              {
                transform: [
                  { scale: Animated.multiply(scaleAnim, growAnim) },
                  { 
                    rotate: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg']
                    })
                  }
                ]
              }
            ]}
            resizeMode="contain"
          />
        </View>

        {/* Wallpaper Preview Grid */}
        <View style={styles.wallpaperContainer}>
          {getWallpaperStyles().map((wallpaper) => (
            <View key={wallpaper.id} style={[styles.wallpaperCard, wallpaper.style]}>
              <Image
                source={wallpaper.image}
                style={styles.wallpaperImage}
                resizeMode="cover"
              />
            </View>
          ))}
        </View>

        {/* Bottom Dark Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
          style={styles.bottomGradient}
          pointerEvents="none"
        />

        {/* Start Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartExplore}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#6d28d9', '#3b82f6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <ChevronRight color="white" size={24} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Start Explore</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

// Create responsive styles function
const getStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1a1a2e',
    },
    gradient: {
      flex: 1,
    },
    header: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: SCREEN_HEIGHT * 0.1,
      paddingHorizontal: SCREEN_WIDTH * 0.05,
      zIndex: 10,
      height: SCREEN_HEIGHT * 0.25,
      marginBottom: SCREEN_HEIGHT * 0.03,
    },
    logo: {
      width: SCREEN_WIDTH * 0.7,
      height: SCREEN_WIDTH * 0.7 * 2.67,
      marginBottom: SCREEN_HEIGHT * 0.08,
    },
    trans: {
      width: SCREEN_WIDTH * 0.4,
      height: SCREEN_WIDTH * 0.4 * 0.67,
      marginTop: SCREEN_HEIGHT * 0.35,
      position: 'absolute',
      resizeMode: 'contain',
      opacity: 1
    },
    subtitle: {
      fontSize: isSmallScreen ? 16 : 18,
      color: '#a0a0a0',
      textAlign: 'center',
      fontWeight: '300',
      marginBottom: 12,
      position: 'absolute',
      bottom: SCREEN_HEIGHT * 0.04,
    },
    wallpaperContainer: {
      flex: 1,
      position: 'relative',
      // Adjusting these values to make space
      marginTop: SCREEN_HEIGHT * 0.02,
      marginBottom: SCREEN_HEIGHT * 0.05, // Increased bottom margin
    },
    wallpaperCard: {
      position: 'absolute',
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: 'silver',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    wallpaperImage: {
      width: '100%',
      height: '100%',
    },
    bottomGradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: SCREEN_HEIGHT * 0.25,
    },
    buttonContainer: {
      paddingHorizontal: SCREEN_WIDTH * 0.1,
      paddingBottom: SCREEN_HEIGHT * 0.08,
      zIndex: 10,
    },
    startButton: {
      borderRadius: 50,
      overflow: 'hidden',
      shadowColor: '#3b82f6',
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 10,
    },
    buttonGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      paddingHorizontal: 40,
      borderRadius: 50,
    },
    buttonIcon: {
      marginRight: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: isSmallScreen ? 16 : 18,
      fontWeight: '600',
    },
  });
};

const styles = getStyles();