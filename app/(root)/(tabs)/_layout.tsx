import { Tabs } from "expo-router";
import { Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import icons from "../../../constants/icons";
import "../../global.css";

const TabIcon = ({
  focused,
  icon,
}: {
  focused: boolean;
  icon: any;
}) => (
  <Image
    source={icon}
    tintColor={focused ? "red" : "black"}
    resizeMode="contain"
    style={{
      marginBottom: -35,
    }}
    className="size-12"
  />
);

const TabsLayout = () => {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#D3D3D3", // Light Gray like the image
          position: "absolute",
          borderTopWidth: 0,
          height: 90, // Adjust height for proper spacing
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          paddingHorizontal: 40,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.gym} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.profile} />
          ),
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: "Chatbot",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="chatbubbles"
              size={34}
              color={focused ? "red" : "black"}
              style={{ marginBottom: -30 }}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
