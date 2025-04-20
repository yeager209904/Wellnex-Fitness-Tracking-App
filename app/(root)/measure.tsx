import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";

import { databases } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { Query } from "react-native-appwrite";
import { ID } from "react-native-appwrite";
import images from "@/constants/images";
import {
  MEASURE_DATABASE_ID,
  MEASURE_COLLECTION_ID,
} from "@env";

type MeasurementKeys = "Weight" | "Height" | "Chest" | "Waist" | "Hips";
type Measurements = Record<MeasurementKeys, string>;

export default function Measure() {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [measurements, setMeasurements] = useState<Measurements>({
    Weight: "",
    Height: "",
    Chest: "",
    Waist: "",
    Hips: "",
  });
  const [documentId, setDocumentId] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchMeasurements();
  }, [user]);

  const fetchMeasurements = async () => {
    if (!user?.$id) return;
    try {
      const response = await databases.listDocuments(
        MEASURE_DATABASE_ID,
        MEASURE_COLLECTION_ID,
        [Query.equal("userId", user.$id)]
      );

      if (response.documents.length > 0) {
        const doc = response.documents[0];
        setDocumentId(doc.$id);
        setMeasurements({
          Weight: doc.Weight.toString(),
          Height: doc.Height.toString(),
          Chest: doc.Chest.toString(),
          Waist: doc.Waist.toString(),
          Hips: doc.Hips.toString(),
        });
      }
    } catch (error) {
      console.error("Error fetching measurements:", error);
    }
  };

  const saveMeasurements = async () => {
    Keyboard.dismiss();
    if (!user) {
      Alert.alert("Error", "You must be logged in!");
      return;
    }

    const payload = {
      Weight: parseFloat(measurements.Weight) || 0,
      Height: parseFloat(measurements.Height) || 0,
      Chest: parseFloat(measurements.Chest) || 0,
      Waist: parseFloat(measurements.Waist) || 0,
      Hips: parseFloat(measurements.Hips) || 0,
      userId: user.$id,
    };

    try {
      if (documentId) {
        await databases.updateDocument(
          MEASURE_DATABASE_ID,
          MEASURE_COLLECTION_ID,
          documentId,
          payload
        );
      } else {
        const newDoc = await databases.createDocument(
          MEASURE_DATABASE_ID,
          MEASURE_COLLECTION_ID,
          ID.unique(),
          payload
        );
        setDocumentId(newDoc.$id);
      }

      Alert.alert("Success", "Measurements saved!");
      router.back();
    } catch (error) {
      console.error("Error saving measurements:", error);
      Alert.alert("Error", "Failed to save measurements.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        scrollEnabled={false}
        contentContainerStyle={{ flexGrow: 1, backgroundColor: "black" }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push("/profile")}>
              <Ionicons
                name="arrow-back"
                size={28}
                color="white"
                style={styles.arrow}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Body Measurements</Text>
          </View>

          {/* Body Image + Inputs */}
          <View style={[styles.imageContainer, { backgroundColor: "black" }]}>
            <Image
              source={images.measure11}
              style={styles.bodyImage}
              resizeMode="contain"
            />

            {/** Height */}
            <View style={[styles.labelContainer, { top: "10%", left: "10%" }]}>
              <Text style={styles.labelText}>Height (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="Height"
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
                value={measurements.Height}
                onChangeText={(v) =>
                  setMeasurements(prev => ({ ...prev, Height: v }))
                }
              />
            </View>

            {/** Chest */}
            <View style={[styles.labelContainer, { top: "28%", left: "55%" }]}>
              <Text style={styles.labelText}>Chest (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="Chest"
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
                value={measurements.Chest}
                onChangeText={(v) =>
                  setMeasurements(prev => ({ ...prev, Chest: v }))
                }
              />
            </View>

            {/** Waist */}
            <View style={[styles.labelContainer, { top: "40%", left: "15%" }]}>
              <Text style={styles.labelText}>Waist (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="Waist"
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
                value={measurements.Waist}
                onChangeText={(v) =>
                  setMeasurements(prev => ({ ...prev, Waist: v }))
                }
              />
            </View>

            {/** Hips */}
            <View style={[styles.labelContainer, { top: "42%", left: "55%" }]}>
              <Text style={styles.labelText}>Hips (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="Hips"
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
                value={measurements.Hips}
                onChangeText={(v) =>
                  setMeasurements(prev => ({ ...prev, Hips: v }))
                }
              />
            </View>

            {/** Weight */}
            <View style={[styles.labelContainer, { top: "75%", left: "5%" }]}>
              <Text style={styles.labelText}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="Weight"
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
                value={measurements.Weight}
                onChangeText={(v) =>
                  setMeasurements(prev => ({ ...prev, Weight: v }))
                }
              />
            </View>
          </View>

          {/* Save Button */}
          <View style={styles.saveButtonContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveMeasurements}
            >
              <Text style={styles.saveButtonText}>Save Measurements</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

// Styles (unchanged)
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  arrow: {
    marginTop: 8,
    marginBottom: 5,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
  },
  imageContainer: {
    width: "100%",
    height: 550,
    position: "relative",
    marginTop: 10,
  },
  bodyImage: {
    width: "100%",
    height: "100%",
  },
  labelContainer: {
    position: "absolute",
    alignItems: "center",
    backgroundColor: "#444",
    padding: 6,
    borderRadius: 8,
    width: 120,
  },
  labelText: {
    color: "white",
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 6,
    borderRadius: 6,
    textAlign: "center",
    width: "100%",
  },
  saveButtonContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#ff3333",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
