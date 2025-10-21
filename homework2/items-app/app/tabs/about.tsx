import { View, Text } from "react-native";

export default function About() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text>
        This items app lists product items and details on each of them.
      </Text>
    </View>
  );
}
