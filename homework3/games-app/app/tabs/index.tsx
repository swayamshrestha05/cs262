import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Game } from "../../types/Item";
import { commonStyles } from "../../styles/common";
import { useGameContext } from "@/context/GameContext";

export default function Index() {
  // Get items from context instead of Json file
  const { games } = useGameContext();
  const router = useRouter();

  // Renders an individual item
  const renderItem = ({ item }: { item: Game }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        router.push({
          pathname: "./details",
          params: { itemId: item.id },
        })
      }
    >
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>Game: {item.id}</Text>
        <Text style={styles.itemCategory}>Time: {item.time}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  // Returns the list of individual games
  return (
    <View style={[commonStyles.container, commonStyles.listPadding]}>
      <FlatList
        data={games}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  arrow: {
    fontSize: 24,
    color: "#ccc",
    marginLeft: 16,
  },
  list: {
    flex: 1,
  },
});
