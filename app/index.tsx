import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useGlobalContext } from "@/lib/global-provider";

const { width } = Dimensions.get('window'); // Get screen width

const Index = () => {
  const router = useRouter();
  const { isLogged } = useGlobalContext();

  const handlePress = () => {
    if (isLogged) {
      router.push('/profile');
    } else {
      router.push('/signup');
    }
  };

  return (
    <ImageBackground source={require('@/assets/images/bg1.jpeg')} style={styles.background}>
      <View style={styles.container}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Welcome to Wellnex</Text>
        <TouchableOpacity onPress={handlePress} style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#dc2626',
    paddingVertical: 16,
    width: width - 40, // Full screen width with padding
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Index;
