import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const SAMPLE_WALLPAPERS = [
  {
    id: 1,
    image: require('../assets/images/cat1.jpeg'),
    style: { top: 120, left: 40, width: 140, height: 200 },
  },
  {
    id: 2,
    image: require('../assets/images/cat2.jpeg'),
    style: { top: 120, right: 40, width: 140, height: 200 },
  },
  {
    id: 3,
    image: require('../assets/images/cat3.jpeg'),
    style: { top: 340, left: 20, width: 100, height: 140 },
  },
  {
    id: 4,
    image: require('../assets/images/cat4.jpeg'),
    style: { top: 340, left: 140, width: 100, height: 140 },
  },
  {
    id: 5,
    image: require('../assets/images/cat5.jpeg'),
    style: { top: 340, right: 20, width: 100, height: 140 },
  },
];

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
        duration: 1500,
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
          {SAMPLE_WALLPAPERS.map((wallpaper) => (
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
      colors={['#6d28d9', '#3b82f6']}  // purple → blue like screenshot
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  gradient: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent:'center',
    paddingTop: 80, // Adjusted padding to keep the logo centered
    paddingHorizontal: 20,
    zIndex: 10,
    height: 200, 
     marginBottom: 20,// Adjusted height for the header to accommodate the logo
  },
  logo:{
     width: 300,   // ✅ similar to your screenshot size
    height: 800, 
    marginBottom: 70  // ✅ balanced height (not huge like 600px)
  },
  trans:{
     width: 180,   // adjust as needed
    height: 120,  // adjust as needed
    marginTop: 320,
    position:'absolute',
    resizeMode: 'contain',
    opacity:1
  },
  subtitle: {
    fontSize: 18,
    color: '#a0a0a0',
    textAlign: 'center',
    fontWeight: '300',
     marginBottom: 12,
      position: 'absolute',   // ✅ keeps subtitle stuck right below logo
  bottom: 30,   
  },
  wallpaperContainer: {
    flex: 1,
    position: 'relative',
    marginTop: 20, // Reduced margin to prevent overlap
  },
  wallpaperCard: {
    position: 'absolute',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
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
    height: 200,
  },
  buttonContainer: {
    paddingHorizontal: 40,
    paddingBottom: 60,
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
    fontSize: 18,
    fontWeight: '600',
  },
});
