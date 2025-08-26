import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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

export default function WelcomeScreen() {
  const handleStartExplore = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>PichoWalls</Text>
          <Text style={styles.subtitle}>Walls that Speak Anime</Text>
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
              colors={['#8b5cf6', '#7c3aed']}
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
    paddingTop: 60,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#a0a0a0',
    textAlign: 'center',
    fontWeight: '300',
  },
  wallpaperContainer: {
    flex: 1,
    position: 'relative',
    marginTop: 40,
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
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#8b5cf6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});