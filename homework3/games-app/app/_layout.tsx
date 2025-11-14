import { Stack } from "expo-router";
import { GameProvider } from "@/context/GameContext";
import { commonStyles, headerConfig } from "../styles/common";

export default function RootLayout() {
  return (
    <GameProvider>
      <Stack>
        <Stack.Screen
          name="tabs"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="details"
          options={{
            title: "Item Details",
            headerStyle: commonStyles.headerStyle,
            headerTintColor: headerConfig.tintColor,
          }}
        />
      </Stack>
    </GameProvider>
  );
}
