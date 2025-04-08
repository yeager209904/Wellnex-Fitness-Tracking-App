import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useGlobalContext } from "@/lib/global-provider";
import { useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import { databases } from "@/lib/appwrite";
import { Query } from "react-native-appwrite";
import { useEffect, useState } from "react";
import "../../global.css";

export default function Index() {
  const { user, loading, routines, setRoutines } = useGlobalContext();
  const router = useRouter();

  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRoutines();
    }
  }, [user]); // Fetch routines when user is available

  const fetchRoutines = async () => {
    if (!user?.$id) return;
    try {
      const response = await databases.listDocuments(
        "67bd43150023c2506475",
        "67c0917a00210d0cb4db",
        [Query.equal("userId", user.$id)]
      );

      const fetchedRoutines = response.documents.map((doc) => ({
        id: doc.$id,
        name: doc.name,
        exercises: JSON.parse(doc.exercises), // Ensure exercises are properly parsed
      }));

      // Filter out duplicates by routine id
      const uniqueRoutines = fetchedRoutines.filter(
        (routine, index, self) =>
          index === self.findIndex((r) => r.id === routine.id)
      );

      setRoutines(uniqueRoutines);
      setFetching(false);
    } catch (error) {
      console.error("Error fetching routines:", error);
      setFetching(false);
    }
  };

  const deleteRoutine = async (routineId: string) => {
    try {
      // Delete the document from Appwrite
      await databases.deleteDocument(
        "67bd43150023c2506475",
        "67c0917a00210d0cb4db",
        routineId
      );
      // Update local state to remove the routine
      setRoutines(routines.filter((routine) => routine.id !== routineId));
    } catch (error) {
      console.error("Error deleting routine:", error);
    }
  };

  return (
    <View className="flex-1 bg-black px-8 pt-16">
      {/* Header */}
      <View className="flex-row justify-between items-center mt-5 mb-4">
        <Text className="text-white font-bold text-xl">WellNex</Text>

        {/* Profile Icon */}
        <Link href="/profile" asChild>
          <TouchableOpacity>
            <FontAwesome name="user-circle" size={28} color="white" />
          </TouchableOpacity>
        </Link>
      </View>

      {/* Welcome Message */}
      <Text className="text-white font-bold text-4xl font-rubik mt-8 mb-3">
        Welcome,{" "}
        <Text className="text-red-500 font-bold">
          {loading ? "..." : user?.name || "Guest"}
        </Text>
        !
      </Text>

      {/* Start New Routine Button */}
      <TouchableOpacity
        className="bg-red-600 py-5 rounded-lg flex-row justify-center items-center w-full mt-5"
        onPress={() => router.push("/(root)/add-routine")}
      >
        <View className="mr-7">
          <FontAwesome name="plus" size={20} color="white" />
        </View>
        <Text className="text-white font-bold text-xl">Start New Routine</Text>
      </TouchableOpacity>

      {/* Routine Cards */}
      <ScrollView
        className="mt-4"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      >
        {routines.map((routine) => (
          <View
            key={routine.id}
            className="bg-gray-900 p-6 my-3 rounded-lg flex-row justify-between items-center"
          >
            <View>
              <Text className="text-white font-bold text-lg">{routine.name}</Text>
              {routine.exercises.map((exercise, idx) => (
                <Text key={idx} className="text-gray-300">
                  {exercise.name} - {exercise.sets} sets x {exercise.reps} reps
                </Text>
              ))}
            </View>
            <TouchableOpacity onPress={() => deleteRoutine(routine.id)}>
              <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Footer Quote */}
      <Text className="text-white text-center mt-4 pb-10">“Trust the process.”</Text>
    </View>
  );
}
