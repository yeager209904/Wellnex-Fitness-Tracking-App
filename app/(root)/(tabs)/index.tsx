import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useGlobalContext } from "@/lib/global-provider";
import { useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import { databases } from "@/lib/appwrite";
import { Query } from "react-native-appwrite";
import { useEffect, useState } from "react";
import { 
  ROUTINES_DATABASE_ID,
  ROUTINES_COLLECTION_ID
} from "@env";
import "../../global.css";

export default function Index() {
  const { user, loading, routines, setRoutines } = useGlobalContext();
  const router = useRouter();
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (user) fetchRoutines();
  }, [user]);

  const fetchRoutines = async () => {
    if (!user?.$id) return;
    try {
      const response = await databases.listDocuments(
        ROUTINES_DATABASE_ID,
        ROUTINES_COLLECTION_ID,
        [ Query.equal("userId", user.$id) ]
      );

      const fetched = response.documents.map(doc => ({
        id: doc.$id,
        name: doc.name,
        exercises: JSON.parse(doc.exercises),
      }));

      // dedupe by id
      const unique = fetched.filter(
        (r, i, arr) => i === arr.findIndex(x => x.id === r.id)
      );

      setRoutines(unique);
    } catch (err) {
      console.error("Error fetching routines:", err);
    } finally {
      setFetching(false);
    }
  };

  const deleteRoutine = async (routineId: string) => {
    try {
      await databases.deleteDocument(
        ROUTINES_DATABASE_ID,
        ROUTINES_COLLECTION_ID,
        routineId
      );
      setRoutines(routines.filter(r => r.id !== routineId));
    } catch (err) {
      console.error("Error deleting routine:", err);
    }
  };

  return (
    <View className="flex-1 bg-black px-8 pt-16">
      {/* Header */}
      <View className="flex-row justify-between items-center mt-5 mb-4">
        <Text className="text-white font-bold text-xl">WellNex</Text>
        <Link href="/profile" asChild>
          <TouchableOpacity>
            <FontAwesome name="user-circle" size={28} color="white" />
          </TouchableOpacity>
        </Link>
      </View>

      {/* Welcome */}
      <Text className="text-white font-bold text-4xl font-rubik mt-8 mb-3">
        Welcome,{" "}
        <Text className="text-red-500 font-bold">
          {loading ? "..." : user?.name || "Guest"}
        </Text>
        !
      </Text>

      {/* New Routine */}
      <TouchableOpacity
        className="bg-red-600 py-5 rounded-lg flex-row justify-center items-center w-full mt-5"
        onPress={() => router.push("/(root)/add-routine")}
      >
        <FontAwesome name="plus" size={20} color="white" className="mr-4" />
        <Text className="text-white font-bold text-xl">
          Start New Routine
        </Text>
      </TouchableOpacity>

      {/* Routines List */}
      <ScrollView
        className="mt-4"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      >
        {routines.map(routine => (
          <View
            key={routine.id}
            className="bg-gray-900 p-6 my-3 rounded-lg flex-row justify-between items-center"
          >
            <View>
              <Text className="text-white font-bold text-lg">
                {routine.name}
              </Text>
              {routine.exercises.map((ex, idx) => (
                <Text key={idx} className="text-gray-300">
                  {ex.name} - {ex.sets} sets x {ex.reps} reps
                </Text>
              ))}
            </View>
            <TouchableOpacity onPress={() => deleteRoutine(routine.id)}>
              <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <Text className="text-white text-center mt-4 pb-10">
        “Trust the process.”
      </Text>
    </View>
  );
}
