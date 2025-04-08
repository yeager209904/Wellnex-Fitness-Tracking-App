import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const exercises = [
  {
    title: 'Full Body Workout',
    youtubeId: 'UIPvIYsjfpo', // Replace with your own video ID
  },
  {
    title: 'Cardio Blast',
    youtubeId: 'rKf6YpYcb1s', // Replace with your own video ID
  },
  {
    title: 'Strength Training Basics',
    youtubeId: 'TN9i9Ni0Xr4', // Replace with your own video ID
  },
  {
    title: 'HIIT Workout',
    youtubeId: 'edIK5SZYMZo', // Dummy video ID - replace with actual ID
  },
  {
    title: 'Core Workout',
    youtubeId: '8PwoytUU06g', // Dummy video ID - replace with actual ID
  },
  {
    title: 'Leg Day Routine',
    youtubeId: '8zWDuWKdBZU', // Dummy video ID - replace with actual ID
  },
  {
    title: 'Upper Body Pump',
    youtubeId: '3IQVNjWH60A', // Dummy video ID - replace with actual ID
  },
  {
    title: 'Flexibility & Stretching',
    youtubeId: 'FI51zRzgIe4', // Dummy video ID - replace with actual ID
  },
  {
    title: 'Yoga for Athletes',
    youtubeId: 'KObUQOsqQKI', // Dummy video ID - replace with actual ID
  },
  {
    title: 'Endurance Training',
    youtubeId: 'VQLU7gpk_X8', // Dummy video ID - replace with actual ID
  },
];

const Exercise = () => {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity onPress={() => router.push('/profile')} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      {/* Page Title */}
      <Text style={styles.pageTitle}>Workout Videos</Text>

      {/* Exercises List */}
      {exercises.map((exercise, index) => (
        <View key={index} style={styles.exerciseContainer}>
          <Text style={styles.title}>{exercise.title}</Text>
          <WebView
            style={styles.video}
            source={{ uri: `https://www.youtube.com/embed/${exercise.youtubeId}` }}
            allowsFullscreenVideo
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 16,
    paddingTop: 40, // Push contents down a bit
  },
  backButton: {
    marginTop:15,
    marginBottom: 8,
  },
  pageTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  exerciseContainer: {
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  video: {
    height: 200,
    width: '100%',
  },
});

export default Exercise;
