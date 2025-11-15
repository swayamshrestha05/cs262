/**
 * Index - Main list view displaying all available games
 *
 * This is the primary screen of the application that displays a list
 * of games fetched from the REST service. Users can tap on a game
 * to view its details such as players's name and scores.
 */

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Game } from "../../types/Monopoly";
import { commonStyles } from "../../styles/common";
import { useGamesContext } from "@/context/GameContext";

export default function Index() {
  // Load items from static JSON data file
  const { games, refreshGames } = useGamesContext();
  const router = useRouter();

  // Renders an individual item
  const renderGame = ({ item }: { item: Game }) => (
    <TouchableOpacity
      style={styles.gameContainer}
      onPress={() =>
        router.push({
          pathname: "../details",
          params: { id: item.id },
        })
      }
    >
      <View style={styles.gameContent}>
        <Text style={styles.gameText}>Game: {item.id}</Text>
        <Text style={styles.timeText}>Time: {item.time}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  // Returns the list of individual items
  return (
    <View style={[commonStyles.container, commonStyles.listPadding]}>
      <FlatList
        data={games}
        renderItem={renderGame}
        keyExtractor={(game) => game.id.toString()}
        onRefresh={refreshGames}
        refreshing={false}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  gameContainer: {
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
  gameContent: {
    flex: 1,
  },
  gameText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  timeText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  gameCategory: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  gameScore: {
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
