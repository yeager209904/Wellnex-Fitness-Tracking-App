import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { login } from "@/lib/appwrite";
import { Redirect } from "expo-router";
import { useGlobalContext } from "@/lib/global-provider";
import images from "@/constants/images";
import tw from "twrnc"; // Import Tailwind for React Native

const Signup = () => {
  const { refetch, loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/" />;

  const handleLogin = async () => {
    const result = await login();
    if (result) {
      refetch();
    } else {
      Alert.alert("Error", "Failed to login");
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      {/* Background Image */}
      <View style={tw`absolute inset-0`}>
        <Image source={images.bg} style={tw`w-full h-full opacity-40`} resizeMode="cover" />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={tw`flex-grow justify-center`}>
        <View style={tw`px-10 items-center`}>
          <Image source={images.logo} style={tw`w-30 h-30 mb-4`} resizeMode="contain" />
          <Text style={tw`text-white text-4xl font-bold text-center`}>WellNex</Text>
          <Text style={tw`text-white text-2xl text-center mt-2`}>Dedicate your Heart</Text>

            <View style={tw`w-full mt-6`}>
    <TouchableOpacity
      onPress={handleLogin}
      style={tw`bg-white p-3 flex-row items-center justify-center rounded-lg mb-4`}
    >
      <Image source={images.google} style={tw`w-6 h-6 mr-3`} resizeMode="contain" />
      <Text style={tw`text-black font-bold text-center`}>Sign up with Google</Text>
    </TouchableOpacity>

  </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
