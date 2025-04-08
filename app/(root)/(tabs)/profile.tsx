import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalContext } from "@/lib/global-provider";
import { useRouter } from "expo-router";
import icons from "@/constants/icons";
import { Routine } from "@/lib/global-provider";
import { BarChart } from "react-native-chart-kit";
import "../../global.css";
import { Ionicons } from '@expo/vector-icons';

const Profile = () => {
  const { user, logout, routines } = useGlobalContext();
  const router = useRouter();
  const [profileImage, setProfileImage] = useState(user?.avatar);
  const [squatWeight, setSquatWeight] = useState("");
  const [benchWeight, setBenchWeight] = useState("");
  const [deadliftWeight, setDeadliftWeight] = useState("");
  const [predictions, setPredictions] = useState<{
    squat: number | null;
    bench: number | null;
    deadlift: number | null;
  }>({ squat: null, bench: null, deadlift: null });

  useEffect(() => {
    const loadImage = async () => {
      const savedImage = await AsyncStorage.getItem("profileImage");
      if (savedImage) setProfileImage(savedImage);
    };
    loadImage();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "You need to allow access to your gallery.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const newImage = result.assets[0].uri;
      setProfileImage(newImage);
      await AsyncStorage.setItem("profileImage", newImage);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const calculateExerciseStats = (routines: Routine[]) => {
    const exerciseStats: { [key: string]: { volume: number; reps: number } } = {};
    routines.forEach((routine) => {
      routine.exercises.forEach((exercise) => {
        if (!exerciseStats[exercise.name]) {
          exerciseStats[exercise.name] = { volume: 0, reps: 0 };
        }
        exerciseStats[exercise.name].volume += exercise.sets * exercise.reps;
        exerciseStats[exercise.name].reps += exercise.reps;
      });
    });
    return exerciseStats;
  };

  const exerciseStats = calculateExerciseStats(routines);

  const navigateToExerciseStats = (type: "volume" | "reps") => {
    router.push({
      pathname: "/exercise-stats",
      params: { type, exerciseStats: JSON.stringify(exerciseStats) },
    });
  };

  const handlePredict = async (squat: string, bench: string, deadlift: string) => {
    const squatNum = parseFloat(squat);
    const benchNum = parseFloat(bench);
    const deadliftNum = parseFloat(deadlift);

    if (isNaN(squatNum) || isNaN(benchNum) || isNaN(deadliftNum)) {
      Alert.alert("Error", "Please enter valid numbers for all weights.");
      return;
    }

    try {
      const response = await fetch("https://wellnex-backend.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Squat1Kg: squatNum,
          Bench1Kg: benchNum,
          Deadlift1Kg: deadliftNum,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get prediction");
      }

      const data = await response.json();
      if (
        data.Best3SquatKg !== undefined &&
        data.Best3BenchKg !== undefined &&
        data.Best3DeadliftKg !== undefined
      ) {
        setPredictions({
          squat: data.Best3SquatKg,
          bench: data.Best3BenchKg,
          deadlift: data.Best3DeadliftKg,
        });
      } else {
        Alert.alert("Error", "Incomplete prediction data received.");
      }
    } catch (error) {
      console.error("Error during prediction:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const getAdjustedDeadlift = () => {
    if (predictions.deadlift === null) return 0;
    const baseDeadlift = parseFloat(deadliftWeight);
    const predictedDeadlift = predictions.deadlift;
    return predictedDeadlift < baseDeadlift ? predictedDeadlift * 1.12 : predictedDeadlift;
  };

  const adjustedDeadlift = getAdjustedDeadlift();

  // Predicted dataset is first to correctly set the y-axis range.
  const chartData = {
    labels: ["Squat", "Bench", "Deadlift"],
    datasets: [
      {
        data: [predictions.squat || 0, predictions.bench || 0, adjustedDeadlift],
        color: (opacity = 1) => `rgba(220, 38, 38, ${opacity})`,
      },
      {
        data: [
          parseFloat(squatWeight) || 0,
          parseFloat(benchWeight) || 0,
          parseFloat(deadliftWeight) || 0,
        ],
        color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
      },
    ],
    legend: ["Predicted", "Base"],
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header and Profile (static) */}
      <View className="px-7">
        <View className="flex-row items-center justify-between mt-5">
          <Text className="text-xl font-rubik-bold text-white">Profile</Text>
          <Image source={icons.bell} className="size-5" style={{ tintColor: "white" }} />
        </View>

        <View className="flex-row items-center mt-7">
          <View className="relative">
            <Image
              source={{ uri: profileImage || "https://via.placeholder.com/150" }}
              style={{ width: 54, height: 54, borderRadius: 100 }}
            />
            <TouchableOpacity className="absolute bottom-0 right-0 p-2" onPress={pickImage}>
              <Image source={icons.edit} className="size-5" style={{ tintColor: "white" }} />
            </TouchableOpacity>
          </View>
          <View className="ml-4">
            <Text className="text-2xl font-rubik-bold text-white">{user?.name || "User"}</Text>
            <Text className="text-lg text-gray-400">Workouts</Text>
          </View>
        </View>
      </View>

      {/* Compressed Prediction Section */}
      <View className="mt-5 px-5" style={{ maxHeight: 170 }}>
        <ScrollView showsVerticalScrollIndicator={true}>
          <View className="w-full border border-gray-600 rounded-lg p-3">
            <Text className="text-lg font-rubik-bold text-white mb-3">Predict Next Weight</Text>
            <View className="mb-3">
              <Text className="text-base text-white mb-1">Squat Weight (kg)</Text>
              <TextInput
                className="bg-gray-800 text-white p-2 rounded"
                placeholder="Enter weight"
                placeholderTextColor="#888"
                value={squatWeight}
                onChangeText={setSquatWeight}
                keyboardType="numeric"
              />
            </View>
            <View className="mb-3">
              <Text className="text-base text-white mb-1">Bench Press Weight (kg)</Text>
              <TextInput
                className="bg-gray-800 text-white p-2 rounded"
                placeholder="Enter weight"
                placeholderTextColor="#888"
                value={benchWeight}
                onChangeText={setBenchWeight}
                keyboardType="numeric"
              />
            </View>
            <View className="mb-3">
              <Text className="text-base text-white mb-1">Deadlift Weight (kg)</Text>
              <TextInput
                className="bg-gray-800 text-white p-2 rounded"
                placeholder="Enter weight"
                placeholderTextColor="#888"
                value={deadliftWeight}
                onChangeText={setDeadliftWeight}
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity
              className="bg-red-600 p-2 rounded"
              onPress={() => handlePredict(squatWeight, benchWeight, deadliftWeight)}
            >
              <Text className="text-white text-center text-sm">Get Prediction</Text>
            </TouchableOpacity>
            {predictions.squat !== null && (
              <Text className="text-white mt-2 text-sm">
                Predicted Squat: {predictions.squat.toFixed(2)} kg
              </Text>
            )}
            {predictions.bench !== null && (
              <Text className="text-white mt-2 text-sm">
                Predicted Bench: {predictions.bench.toFixed(2)} kg
              </Text>
            )}
            {predictions.deadlift !== null && (
              <Text className="text-white mt-2 text-sm">
                Predicted Deadlift: {adjustedDeadlift.toFixed(2)} kg
              </Text>
            )}
            {(predictions.squat !== null ||
              predictions.bench !== null ||
              predictions.deadlift !== null) && (
              <View className="mt-3">
                <Text className="text-base font-rubik-bold text-white mb-2">
                  Weights Comparison Chart
                </Text>
                <BarChart
                  data={chartData}
                  width={Dimensions.get("window").width - 60}
                  height={150}
                  yAxisLabel=""
                  yAxisSuffix=" kg"
                  chartConfig={{
                    backgroundColor: "#000",
                    backgroundGradientFrom: "#000",
                    backgroundGradientTo: "#000",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 80, 80, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: { borderRadius: 16 },
                    barPercentage: 0.5,
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                  withCustomBarColorFromData={true}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Dashboard Section (static) */}
      <View className="mt-6 px-7">
        <View className="flex-row justify-between">
          <TouchableOpacity
            className="border border-gray-600 p-4 rounded-lg w-[48%]"
            onPress={() => navigateToExerciseStats("volume")}
          >
            <Text className="text-lg text-center font-rubik-bold text-white">Volume</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="border border-gray-600 p-4 rounded-lg w-[48%]"
            onPress={() => navigateToExerciseStats("reps")}
          >
            <Text className="text-lg text-center font-rubik-bold text-white">Reps</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-12">
          <Text className="text-3xl font-rubik-bold text-white mb-6">Dashboard</Text>
          <View className="flex-row flex-wrap justify-between">
          <TouchableOpacity
            className="w-1/2 flex-row items-center mb-6"
            onPress={() => router.push("/(root)/info")} >
            <Ionicons name="information-circle-outline" size={24} color="white" className="mr-4" />
            <Text className="text-xl font-rubik-bold text-white">Info</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-1/2 flex-row items-center mb-6"
            onPress={() => router.push("/(root)/exercise")}>
              <Image source={icons.exercise} className="size-6 mr-4" style={{ tintColor: "white" }} />
              <Text className="text-xl font-rubik-bold text-white">Exercise</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-1/2 flex-row items-center"
              onPress={() => router.push("/(root)/measure")}
            >
              <Image source={icons.measure} className="size-6 mr-4" style={{ tintColor: "white" }} />
              <Text className="text-xl font-rubik-bold text-white">Measure</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-1/2 flex-row items-center"
              onPress={() => router.push("/calendar")}
            >
              <Image source={icons.calendar} className="size-6 mr-4" style={{ tintColor: "white" }} />
              <Text className="text-xl font-rubik-bold text-white">Calendar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Logout Button (static at the bottom) */}
      <View className="mt-12 px-7 items-center">
        <TouchableOpacity onPress={handleLogout} className="bg-red-600 p-4 rounded-lg w-full items-center">
          <Text className="text-lg font-rubik-bold text-white">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
