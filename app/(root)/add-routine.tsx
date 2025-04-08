import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { databases } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { ID } from "react-native-appwrite";
import Ionicons from "react-native-vector-icons/Ionicons";
import "./../global.css";

type Routine = {
  name: string;
  exercises: { name: string; sets: number; reps: number }[];
  userId?: string;
};

export default function AddRoutine() {
  const router = useRouter();
  const { user, addRoutine } = useGlobalContext();

  // Always start with an empty routine; we no longer fetch an existing one
  const [routine, setRoutine] = useState<Routine>({
    name: "",
    exercises: [],
  });

  const saveRoutine = async () => {
    Keyboard.dismiss();
    if (!user) return Alert.alert("Error", "You must be logged in!");

    if (!routine.name.trim()) {
      Alert.alert("Error", "Please enter a routine name.");
      return;
    }

    if (routine.exercises.length === 0) {
      Alert.alert("Error", "Please select at least one exercise.");
      return;
    }

    try {
      const data = {
        name: routine.name.trim(),
        exercises: JSON.stringify(routine.exercises),
        userId: user.$id,
      };

      // Always create a new document with a unique ID using ID.unique()
      const newDocument = await databases.createDocument(
        "67bd43150023c2506475",
        "67c0917a00210d0cb4db",
        ID.unique(),
        data
      );

      // Add the routine to the global state
      addRoutine({
        id: newDocument.$id,
        name: routine.name,
        exercises: routine.exercises,
      });

      Alert.alert("Success", "Routine saved!");
      router.back();
    } catch (error) {
      console.error("Error saving routine:", error);
      Alert.alert("Error", "Failed to save routine.");
    }
  };

  const exercisesList = [
    "Push-ups",
    "Squats",
    "Pull-ups",
    "Lunges",
    "Plank",
    "Deadlifts",
    "Bench Press",
    "Bicep Curls",
  ];

  const handleAddExercise = (exerciseName: string) => {
    if (
      exerciseName &&
      !routine.exercises.some((e) => e.name === exerciseName)
    ) {
      setRoutine((prev) => ({
        ...prev,
        exercises: [...prev.exercises, { name: exerciseName, sets: 3, reps: 10 }],
      }));
    }
  };

  const updateExercise = (index: number, field: "sets" | "reps", value: string) => {
    const updatedExercises = [...routine.exercises];
    updatedExercises[index][field] = parseInt(value) || 0;
    setRoutine((prev) => ({ ...prev, exercises: updatedExercises }));
  };

  const handleRemoveExercise = (exerciseName: string) => {
    setRoutine((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((e) => e.name !== exerciseName),
    }));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 px-8 pt-1">
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} className="mb-4 mt-5">
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>

          <View className="mt-[-12]">
            <Text className="text-white text-2xl font-bold mb-4 text-center">
              Add Routine
            </Text>
          </View>

          {/* Routine Name Input */}
          <Text className="text-white font-bold mb-2">Routine Name</Text>
          <TextInput
            className="bg-gray-800 text-white px-5 py-3 rounded-lg shadow-lg mb-4"
            placeholder="Enter routine name"
            placeholderTextColor="#999"
            value={routine.name}
            onChangeText={(value) =>
              setRoutine((prev) => ({ ...prev, name: value }))
            }
          />

          {/* Exercise Dropdown */}
          <Text className="text-white font-bold mb-2">Select Exercises:</Text>
          <View className="bg-gray-800 rounded-lg mb-4">
            <Picker
              selectedValue=""
              onValueChange={(itemValue) => handleAddExercise(itemValue)}
              style={{ color: "white" }}
            >
              <Picker.Item label="Select an exercise" value="" />
              {exercisesList.map((exercise, index) => (
                <Picker.Item key={index} label={exercise} value={exercise} />
              ))}
            </Picker>
          </View>

          {/* Scrollable Exercises List */}
          <ScrollView
            className="flex-1 mb-4"
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {routine.exercises.map((exercise, index) => (
              <View key={index} className="bg-gray-700 p-3 rounded-lg mb-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-white">{exercise.name}</Text>
                  <TouchableOpacity onPress={() => handleRemoveExercise(exercise.name)}>
                    <Ionicons name="trash" size={20} color="red" />
                  </TouchableOpacity>
                </View>

                <View className="flex-row justify-between mt-2">
                  <View className="w-[48%]">
                    <Text className="text-white mb-1">Sets</Text>
                    <TextInput
                      className="bg-gray-800 text-white p-2 rounded-lg text-center"
                      keyboardType="numeric"
                      value={exercise.sets.toString()}
                      onChangeText={(value) => updateExercise(index, "sets", value)}
                    />
                  </View>

                  <View className="w-[48%]">
                    <Text className="text-white mb-1">Reps</Text>
                    <TextInput
                      className="bg-gray-800 text-white p-2 rounded-lg text-center"
                      keyboardType="numeric"
                      value={exercise.reps.toString()}
                      onChangeText={(value) => updateExercise(index, "reps", value)}
                    />
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Save Button (Fixed at Bottom) */}
        <View className="px-8 pb-8 bg-black">
          <TouchableOpacity
            className="bg-red-600 py-4 rounded-lg flex-row justify-center items-center w-full"
            onPress={saveRoutine}
          >
            <Text className="text-white font-bold text-lg">Save Routine</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
