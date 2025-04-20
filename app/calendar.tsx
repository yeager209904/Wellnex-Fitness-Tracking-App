import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { databases } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { Query } from "react-native-appwrite";
import {
  CALENDAR_DATABASE_ID,
  CALENDAR_COLLECTION_ID,
} from "@env";

const CalendarScreen = () => {
  const { user } = useGlobalContext();
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState("");
  const [streakCount, setStreakCount] = useState(0);
  const [restCount, setRestCount] = useState(0);
  const [lastStreakDate, setLastStreakDate] = useState("");

  useEffect(() => {
    if (user) fetchCalendarData();
  }, [user]);

  const fetchCalendarData = async () => {
    try {
      const response = await databases.listDocuments(
        CALENDAR_DATABASE_ID,
        CALENDAR_COLLECTION_ID,
        [Query.equal("userId", user!.$id)]
      );

      if (response.documents.length > 0) {
        const sorted = response.documents.sort((a, b) =>
          b.date.localeCompare(a.date)
        );

        let latestStreak = 0;
        let totalRest = 0;

        for (const doc of sorted) {
          if (doc.streak > 0 && latestStreak === 0) {
            latestStreak = doc.streak;
            setLastStreakDate(doc.date);
          }
          if (doc.rest > 0) {
            totalRest += doc.rest;
          }
        }

        setStreakCount(latestStreak);
        setRestCount(totalRest);
      }
    } catch (err) {
      console.error("Error fetching calendar data:", err);
    }
  };

  const saveCalendarData = async (
    day: DateData,
    type: "streak" | "rest",
    count: number
  ) => {
    if (!user) {
      Alert.alert("Error", "User not logged in.");
      return;
    }

    const payload = {
      userId: user.$id,
      date: day.dateString,
      streak: type === "streak" ? count : 0,
      rest: type === "rest" ? count : 0,
    };

    try {
      await databases.createDocument(
        CALENDAR_DATABASE_ID,
        CALENDAR_COLLECTION_ID,
        /* use Appwrite’s ID.unique() if you prefer: */ "unique()",
        payload
      );
    } catch (err) {
      console.error("Error saving calendar data:", err);
    }
  };

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    Alert.alert(
      "Select Day Type",
      `Mark ${day.dateString} as a Streak or Rest day?`,
      [
        { text: "Streak", onPress: () => handleStreak(day) },
        { text: "Rest", onPress: () => handleRest(day) },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleStreak = (day: DateData) => {
    const selected = new Date(day.dateString);
    let newStreak = 1;

    if (lastStreakDate) {
      const last = new Date(lastStreakDate);
      const diff = (selected.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
      newStreak = diff === 1 ? streakCount + 1 : 1;
    }

    setStreakCount(newStreak);
    setLastStreakDate(day.dateString);
    saveCalendarData(day, "streak", newStreak);
  };

  const handleRest = (day: DateData) => {
    const newRest = restCount + 1;
    setRestCount(newRest);
    saveCalendarData(day, "rest", newRest);
  };

  return (
    <SafeAreaView className="h-full bg-black p-4">
      {/* Back Button */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-xl font-rubik-bold text-white ml-2">
          Select Date
        </Text>
      </View>

      {/* Streak & Rest Summary */}
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
          [selectedDate]: { selected: true, selectedColor: "#ff3b30" },
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

      {selectedDate ? (
        <Text className="text-lg text-white mt-4">
          Selected Date: {selectedDate}
        </Text>
      ) : null}
    </SafeAreaView>
  );
};

export default CalendarScreen;
