import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import "./../global.css";

type ExerciseStats = {
  [key: string]: { volume: number; reps: number };
};

const ExerciseStatsScreen = () => {
  const { type, exerciseStats } = useLocalSearchParams<{
    type: "volume" | "reps";
    exerciseStats: string;
  }>();
  const router = useRouter();

  // Parse the exerciseStats string back to an object
  let stats: ExerciseStats = {};
  try {
    stats = exerciseStats ? JSON.parse(exerciseStats) : {};
  } catch (error) {
    console.error("Error parsing exerciseStats:", error);
  }

  // Calculate total volume or reps for all exercises
  const total = Object.values(stats).reduce((sum, exercise) => {
    return sum + (type === "volume" ? exercise.volume : exercise.reps);
  }, 0);

  return (
    <View className="flex-1 bg-black p-6 pt-8">
      {/* Header with Back Icon */}
      <View className="flex-row items-center mb-6 mt-10">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-red-500 text-2xl font-bold ml-4">
          {type === "volume" ? "Volume" : "Reps"} Summary
        </Text>
      </View>

      {/* Display Total */}
      <Text className="text-red-400 text-xl font-semibold mb-4">
        Total {type === "volume" ? "Volume" : "Reps"}:{" "}
        <Text className="text-white">{total}</Text>
      </Text>

      {/* Display Individual Exercises */}
      <ScrollView>
        {Object.entries(stats).map(([exerciseName, stats]) => (
          <View
            key={exerciseName}
            className="bg-red-900 p-4 rounded-lg mb-3 border border-red-600"
          >
            <Text className="text-white text-lg font-bold">
              {exerciseName}
            </Text>
            <Text className="text-red-400">
              {type === "volume"
                ? `Volume: ${stats.volume}`
                : `Reps: ${stats.reps}`}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ExerciseStatsScreen;