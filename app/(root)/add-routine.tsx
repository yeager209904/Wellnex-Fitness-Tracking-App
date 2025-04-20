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
import {
  ROUTINES_DATABASE_ID,
  ROUTINES_COLLECTION_ID,
} from "@env";
import "./../global.css";

type Routine = {
  name: string;
  exercises: { name: string; sets: number; reps: number }[];
  userId?: string;
};

export default function AddRoutine() {
  const router = useRouter();
  const { user, addRoutine } = useGlobalContext();

  const [routine, setRoutine] = useState<Routine>({
    name: "",
    exercises: [],
  });

  const saveRoutine = async () => {
    Keyboard.dismiss();
    if (!user) return Alert.alert("Error", "You must be logged in!");

    if (!routine.name.trim()) {
      return Alert.alert("Error", "Please enter a routine name.");
    }
    if (routine.exercises.length === 0) {
      return Alert.alert("Error", "Please select at least one exercise.");
    }

    try {
      const payload = {
        name: routine.name.trim(),
        exercises: JSON.stringify(routine.exercises),
        userId: user.$id,
      };

      const newDoc = await databases.createDocument(
        ROUTINES_DATABASE_ID,
        ROUTINES_COLLECTION_ID,
        ID.unique(),
        payload
      );

      addRoutine({
        id: newDoc.$id,
        name: routine.name,
        exercises: routine.exercises,
      });

      Alert.alert("Success", "Routine saved!");
      router.back();
    } catch (err) {
      console.error("Error saving routine:", err);
      Alert.alert("Error", "Failed to save routine.");
    }
  };

  const exercisesList = [
    "Push‑ups",
    "Squats",
    "Pull‑ups",
    "Lunges",
    "Plank",
    "Deadlifts",
    "Bench Press",
    "Bicep Curls",
  ];

  const handleAddExercise = (name: string) => {
    if (name && !routine.exercises.some(e => e.name === name)) {
      setRoutine(prev => ({
        ...prev,
        exercises: [...prev.exercises, { name, sets: 3, reps: 10 }],
      }));
    }
  };

  const updateExercise = (
    idx: number,
    field: "sets" | "reps",
    val: string
  ) => {
    const list = [...routine.exercises];
    list[idx][field] = parseInt(val, 10) || 0;
    setRoutine(prev => ({ ...prev, exercises: list }));
  };

  const handleRemove = (name: string) => {
    setRoutine(prev => ({
      ...prev,
      exercises: prev.exercises.filter(e => e.name !== name),
    }));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 px-8 pt-1">
          <TouchableOpacity onPress={() => router.back()} className="mb-4 mt-5">
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>

          <Text className="text-white text-2xl font-bold mb-4 text-center">
            Add Routine
          </Text>

          <Text className="text-white font-bold mb-2">Routine Name</Text>
          <TextInput
            className="bg-gray-800 text-white px-5 py-3 rounded-lg shadow-lg mb-4"
            placeholder="Enter routine name"
            placeholderTextColor="#999"
            value={routine.name}
            onChangeText={v => setRoutine(prev => ({ ...prev, name: v }))}
          />

          <Text className="text-white font-bold mb-2">
            Select Exercises:
          </Text>
          <View className="bg-gray-800 rounded-lg mb-4">
            <Picker
              selectedValue=""
              onValueChange={handleAddExercise}
              style={{ color: "white" }}
            >
              <Picker.Item label="Select an exercise" value="" />
              {exercisesList.map((ex, i) => (
                <Picker.Item key={i} label={ex} value={ex} />
              ))}
            </Picker>
          </View>

          <ScrollView
            className="flex-1 mb-4"
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {routine.exercises.map((ex, i) => (
              <View
                key={i}
                className="bg-gray-700 p-3 rounded-lg mb-2"
              >
                <View className="flex-row justify-between items-center">
                  <Text className="text-white">{ex.name}</Text>
                  <TouchableOpacity onPress={() => handleRemove(ex.name)}>
                    <Ionicons name="trash" size={20} color="red" />
                  </TouchableOpacity>
                </View>

                <View className="flex-row justify-between mt-2">
                  <View className="w-[48%]">
                    <Text className="text-white mb-1">Sets</Text>
                    <TextInput
                      className="bg-gray-800 text-white p-2 rounded-lg text-center"
                      keyboardType="numeric"
                      value={ex.sets.toString()}
                      onChangeText={v => updateExercise(i, "sets", v)}
                    />
                  </View>
                  <View className="w-[48%]">
                    <Text className="text-white mb-1">Reps</Text>
                    <TextInput
                      className="bg-gray-800 text-white p-2 rounded-lg text-center"
                      keyboardType="numeric"
                      value={ex.reps.toString()}
                      onChangeText={v => updateExercise(i, "reps", v)}
                    />
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View className="px-8 pb-8 bg-black">
          <TouchableOpacity
            className="bg-red-600 py-4 rounded-lg flex-row justify-center items-center w-full"
            onPress={saveRoutine}
          >
            <Text className="text-white font-bold text-lg">
              Save Routine
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
