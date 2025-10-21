import { Stack } from "expo-router";
import { ItemProvider } from "@/context/ItemContext";
import { commonStyles, headerConfig } from "../styles/common";

export default function RootLayout() {
  return (
    <ItemProvider>
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
    </ItemProvider>
  );
}
