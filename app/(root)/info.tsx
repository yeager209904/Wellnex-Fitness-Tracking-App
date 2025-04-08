import { View, Text, TouchableOpacity, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

const Info = () => {
  const router = useRouter();
  const [showCredits, setShowCredits] = useState(false);
  const scrollY = useRef(new Animated.Value(600)).current; // Start position

  useEffect(() => {
    if (showCredits) {
      const loopAnimation = () => {
        scrollY.setValue(600); // Reset to bottom
        Animated.timing(scrollY, {
          toValue: -600, // Move upwards
          duration: 8000, // 8s for Star Wars effect
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(() => loopAnimation()); // Restart when finished
      };

      loopAnimation(); // Start animation
    }
  }, [showCredits]);

  if (showCredits) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Animated.View style={{ transform: [{ translateY: scrollY }] }}>
          <Text className="text-center text-yellow-500 text-2xl font-extrabold">
             A SPECIAL THANK YOU TO OUR MENTOR
          </Text>
          <Text className="text-center text-yellow-400 text-lg mt-4">
            Dr. T Keerthika
          </Text>
          <Text className="text-center text-yellow-500 text-lg font-extrabold mt-6">
            TEAM 2
          </Text>
          <Text className="text-center text-yellow-400 text-lg mt-2">
            Starring
          </Text>
          <Text className="text-center text-yellow-300 text-lg font-bold mt-1">
            Anerud Thiyagarajan
          </Text>
          <Text className="text-center text-yellow-300 text-lg font-bold">
            Giri Prasad
          </Text>
          <Text className="text-center text-yellow-300 text-lg font-bold">
            KL Amritha Nandini
          </Text>
          <Text className="text-center text-yellow-300 text-lg font-bold">
            Vishal S
          </Text>
          <Text className="text-center text-yellow-500 text-xl font-extrabold mt-6">
             THE END 
          </Text>
        </Animated.View>

        {/* Back Button */}
        <TouchableOpacity
          onPress={() => setShowCredits(false)}
          className="absolute bottom-10 bg-red-600 p-4 rounded-lg"
        >
          <Text className="text-white text-lg font-bold">Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black p-6">
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.push('/profile')} className="mt-10 mb-2">
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      {/* Title Section */}
      <View className="mt-6 mb-6 border-b-2 border-red-600 pb-2">
        <Text className="text-4xl font-extrabold text-red-500 text-center uppercase">
          Fitness Info
        </Text>
      </View>

      {/* Fitness Info Items */}
      <View className="space-y-4">
        <Text className="text-lg text-red-400">
          <Text className="text-xl">🏋️‍♂️</Text>{" "}
          <Text className="text-red-500 font-bold">Strength Training:</Text>
          <Text className="text-white">
            {" "}
            Focus on compound movements like squats, deadlifts, and bench press
            for overall strength.
          </Text>
        </Text>

        <Text className="text-lg text-red-400">
          <Text className="text-xl">🏃‍♀️</Text>{" "}
          <Text className="text-red-500 font-bold">Cardio Health:</Text>
          <Text className="text-white">
            {" "}
            Regular cardiovascular exercises like running, cycling, or rowing
            improve heart health.
          </Text>
        </Text>

        <Text className="text-lg text-red-400">
          <Text className="text-xl">🍎</Text>{" "}
          <Text className="text-red-500 font-bold">Nutrition:</Text>
          <Text className="text-white">
            {" "}
            A balanced diet with protein, healthy fats, and complex carbs
            supports fitness goals.
          </Text>
        </Text>

        <Text className="text-lg text-red-400">
          <Text className="text-xl">💤</Text>{" "}
          <Text className="text-red-500 font-bold">Rest & Recovery:</Text>
          <Text className="text-white">
            {" "}
            Quality sleep (7-9 hours) and proper rest days enhance muscle
            recovery.
          </Text>
        </Text>

        <Text className="text-lg text-red-400">
          <Text className="text-xl">💪</Text>{" "}
          <Text className="text-red-500 font-bold">Progressive Overload:</Text>
          <Text className="text-white">
            {" "}
            Increase weights or reps gradually to gain strength and muscle.
          </Text>
        </Text>
      </View>

      {/* Centered Credits Button */}
      <View className="bottom-12 absolute w-full flex-row justify-center pl-25">
  <TouchableOpacity
    onPress={() => setShowCredits(true)}
    className="absolute bottom-10 bg-red-600 p-4 rounded-lg"
  >
    <Text className="text-white text-lg font-bold">Credits</Text>
  </TouchableOpacity>
</View>
    </View>
  );
};

export default Info;
