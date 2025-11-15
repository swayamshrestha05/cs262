import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { commonStyles, headerConfig } from "../../styles/common";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Games",
          tabBarIcon: ({ color }) => (
            <Ionicons name="list" color={color} size={24} />
          ),
          tabBarLabel: "Games",
          headerStyle: commonStyles.headerStyle,
          headerTintColor: headerConfig.tintColor,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color }) => (
            <Ionicons name="information-circle" color={color} size={24} />
          ),
          headerStyle: commonStyles.headerStyle,
          headerTintColor: headerConfig.tintColor,
        }}
      />
    </Tabs>
  );
}
