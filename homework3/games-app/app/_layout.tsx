import { Stack } from "expo-router";
import { GamesProvider } from "@/context/GameContext";
import { commonStyles, headerConfig } from "../styles/common";

export default function RootLayout() {
  return (
    <GamesProvider>
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
            title: "Game Details",
            headerStyle: commonStyles.headerStyle,
            headerTintColor: headerConfig.tintColor,
          }}
        />
      </Stack>
    </GamesProvider>
  );
}
