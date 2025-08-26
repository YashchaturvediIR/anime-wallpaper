import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { Colors } from '../constants/Colors';

export default function Welcome() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleStartExplore = () => {
    setIsNavigating(true);
    // Wait for the fadeout animation to complete before navigating
    setTimeout(() => {
      router.push('/(tabs)');
    }, 500); // Match the duration of the fadeout animation
  };

  return (
    <Animated.View 
      style={styles.container}
      exiting={isNavigating ? FadeOut.duration(500) : undefined}
    >
      <StatusBar style="light" />
      <Image
        source={require('../assets/images/welcome.png')}
        style={styles.bgImage}
        resizeMode='cover'
      />
      {/**linear gradient */}
      <Animated.View entering={FadeInDown.duration(600)} style={{flex:1}}>
        <LinearGradient
          colors={['rgba(255,255,255,0)','rgba(255,255,255,0.5)', 'white','white']}
          style={styles.gradient}
          start={{x:0.5,y:0}}
          end={{x:0.5,y:0.8}}
        />
        {/**content */}
        <View style={styles.contentContainer}>
          <Animated.Text
            entering={FadeInDown.delay(400).springify()}
            style={styles.title}>
            Pixels
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(500).springify()}
            style={styles.punchLine}>
            Every pixel tells a story
          </Animated.Text>
          <Animated.View
            entering={FadeInDown.delay(600).springify()}>
            <Pressable onPress={handleStartExplore} style={styles.startButton}>
              <Text style={styles.startText}>Start Explore</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bgImage: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  gradient: {
    width: '100%',
    height: '65%',
    bottom: 0,
    position: 'absolute'
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 14
  },
  title: {
    fontSize: 40,
    color: Colors.light.text,
    fontWeight: 'bold'
  },
  punchLine: {
    fontSize: 16,
    letterSpacing: 1,
    marginBottom: 10,
    fontWeight: '500'
  },
  startButton: {
    marginBottom: 50,
    backgroundColor: Colors.light.tint,
    padding: 15,
    paddingHorizontal: 90,
    borderRadius: 20,
  },
  startText: {
    color: Colors.light.background,
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 1
  }
});
