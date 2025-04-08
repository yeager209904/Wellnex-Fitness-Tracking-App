import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { databases } from "@/lib/appwrite"; 
import { useGlobalContext } from "@/lib/global-provider";
import { Query } from "react-native-appwrite";

const CalendarScreen = () => {
  const { user } = useGlobalContext();
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState("");
  const [streakCount, setStreakCount] = useState(0);
  const [restCount, setRestCount] = useState(0);
  const [lastStreakDate, setLastStreakDate] = useState("");

  // Fetch calendar data on mount (and when user changes)
  useEffect(() => {
    if (user) {
      fetchCalendarData();
    }
  }, [user]);

  /**
   * Fetches all calendar documents for the current user,
   * then aggregates the streak and rest counts.
   */
  const fetchCalendarData = async () => {
    try {
      const response = await databases.listDocuments(
        "67bd43150023c2506475",  // Your database ID
        "67dc491f0036b61658c1",  // Your collection ID
        [Query.equal("userId",  user?.$id ?? "")]
      );

      if (response.documents.length > 0) {
        // Sort documents in descending order by date (assuming date is stored as YYYY-MM-DD or ISO string)
        const sortedDocs = response.documents.sort((a, b) =>
          b.date.localeCompare(a.date)
        );

        let latestStreak = 0;
        let totalRest = 0;
        // Find the first document (most recent) with a streak value > 0
        for (let doc of sortedDocs) {
          if (doc.streak && doc.streak > 0 && latestStreak === 0) {
            latestStreak = doc.streak;
            setLastStreakDate(doc.date);
          }
          if (doc.rest && doc.rest > 0) {
            totalRest += doc.rest;
          }
        }
        setStreakCount(latestStreak);
        setRestCount(totalRest);
      }
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    }
  };

  /**
   * Saves the calendar data to Appwrite.
   * Always sends both "streak" and "rest" attributes.
   */
  const saveCalendarData = async (
    day: DateData,
    type: "streak" | "rest",
    count: number
  ) => {
    if (!user) {
      Alert.alert("Error", "User not logged in.");
      return;
    }

    // For a "streak" day, streak is count and rest is 0.
    // For a "rest" day, rest is count and streak is 0.
    const data = {
      userId: user.$id,
      date: day.dateString, // Ensure this format matches your ordering needs
      streak: type === "streak" ? count : 0,
      rest: type === "rest" ? count : 0,
    };

    try {
      await databases.createDocument(
        "67bd43150023c2506475",
        "67dc491f0036b61658c1",
        "unique()",
        data
      );
      console.log("Calendar data saved:", data);
    } catch (error) {
      console.error("Error saving calendar data:", error);
    }
  };

  /**
   * Handles the day press event by showing an alert to select type.
   */
  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);

    Alert.alert(
      "Select Day Type",
      `Mark ${day.dateString} as a Streak or Rest day?`,
      [
        {
          text: "Streak",
          onPress: () => handleStreak(day),
        },
        {
          text: "Rest",
          onPress: () => handleRest(day),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  /**
   * When the user selects "Streak" for a day,
   * check if it's consecutive to increment or reset the streak.
   */
  const handleStreak = (day: DateData) => {
    const selected = new Date(day.dateString);
    let newStreak = 1;

    if (lastStreakDate) {
      const lastDate = new Date(lastStreakDate);
      const diffTime = selected.getTime() - lastDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      newStreak = diffDays === 1 ? streakCount + 1 : 1;
    }

    setStreakCount(newStreak);
    setLastStreakDate(day.dateString);
    saveCalendarData(day, "streak", newStreak);
  };

  /**
   * When the user selects "Rest" for a day,
   * simply increment the rest count.
   */
  const handleRest = (day: DateData) => {
    const newRest = restCount + 1;
    setRestCount(newRest);
    saveCalendarData(day, "rest", newRest);
  };

  return (
    <SafeAreaView className="h-full bg-black p-4">
      {/* Back button */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-xl font-rubik-bold text-white ml-2">
          Select Date
        </Text>
      </View>

      {/* Display Streak and Rest Counts */}
      <View className="flex-row justify-between mb-4">
        <View className="flex-row items-center border-2 border-white p-3 rounded-lg">
          <Ionicons name="flame" size={24} color="#ff3b30" />
          <View className="ml-2">
            <Text className="text-white text-lg">{streakCount} days</Text>
            <Text className="text-gray-400">Streak</Text>
          </View>
        </View>
        <View className="flex-row items-center border-2 border-white p-3 rounded-lg">
          <Ionicons name="moon" size={24} color="#1e90ff" />
          <View className="ml-2">
            <Text className="text-white text-lg">{restCount} days</Text>
            <Text className="text-gray-400">Rest</Text>
          </View>
        </View>
      </View>

      {/* Calendar */}
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: "#ff3b30",
          },
        }}
        theme={{
          backgroundColor: "#000",
          calendarBackground: "#000",
          textSectionTitleColor: "#ff3b30",
          selectedDayBackgroundColor: "#ff3b30",
          selectedDayTextColor: "#fff",
          todayTextColor: "#ff3b30",
          dayTextColor: "#fff",
          textDisabledColor: "#444",
          arrowColor: "#ff3b30",
          monthTextColor: "#ff3b30",
          indicatorColor: "#ff3b30",
        }}
      />

      {/* Selected Date Display */}
      {selectedDate ? (
        <Text className="text-lg text-white mt-4">
          Selected Date: {selectedDate}
        </Text>
      ) : null}
    </SafeAreaView>
  );
};

export default CalendarScreen;
