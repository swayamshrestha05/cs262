/**
 * Details - Individual game details view
 *
 * This screen displays the players and their scores for the selected game.
 * It fetches data from the backend using GET /games/:id through GamesContext.
 */

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useGamesContext } from "@/context/GameContext";
import { GamePlayer, Game } from "../types/Monopoly";
import { commonStyles } from "../styles/common";

const BASE_URL = "http://153.106.223.189:3000";

export default function Details() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { fetchPlayers, setGames, games } = useGamesContext();

  const selectedGame: Game = games.find((game) => game.id === Number(id)) || {
    id: 0,
    time: "",
  };

  const [players, setPlayers] = useState<GamePlayer[]>([]);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const data = await fetchPlayers(Number(id));
          setPlayers(data);
        } catch (error) {
          console.error("Error loading players:", error);
        }
      })();
    }
  }, [id, fetchPlayers]);

  const handleDelete = () => {
    if (!selectedGame.id) return;

    if (Platform.OS === "web") {
      const confirmed =
        typeof window !== "undefined" &&
        window.confirm(`Are you sure you want to delete "${selectedGame.id}"?`);
      if (confirmed) {
        (async () => {
          try {
            const response = await fetch(
              `${BASE_URL}/games/${selectedGame.id}`,
              {
                method: "DELETE",
              }
            );

            if (!response.ok) {
              throw new Error(
                `Failed to delete game with ID ${selectedGame.id}`
              );
            }

            setGames((prev) => prev.filter((g) => g.id !== selectedGame.id));

            console.log(`Game ${selectedGame.id} deleted successfully.`);
            router.back();
          } catch (error) {
            console.error("Error deleting game:", error);
            alert("Failed to delete the game. Please try again.");
          }
        })();
      }
      return;
    }
    Alert.alert(
      "Delete Game",
      `Are you sure you want to delete "${selectedGame.id}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(
                `${BASE_URL}/games/${selectedGame.id}`,
                {
                  method: "DELETE",
                }
              );

              if (!response.ok) {
                throw new Error(
                  `Failed to delete game with ID ${selectedGame.id}`
                );
              }
              setGames((prev) => prev.filter((g) => g.id !== selectedGame.id));
              router.back();
            } catch (error) {
              console.error("Error deleting game:", error);
              Alert.alert("Error", "Failed to delete the game.");
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.contentPadding}>
        <View style={styles.header}>
          <Text style={styles.titleText}>Game: {selectedGame.id}</Text>
        </View>

        <View style={commonStyles.whiteCard}>
          <Text style={styles.labelText}>Time</Text>
          <Text style={styles.bodyText}>{selectedGame.time || "N/A"}</Text>
        </View>

        <View style={commonStyles.whiteCard}>
          <Text style={styles.labelText}>Players & Scores</Text>
          {players.length > 0 ? (
            <FlatList
              data={players}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View>
                  <View style={styles.playerRow}>
                    <View style={styles.playerInfo}>
                      <Text style={styles.rank}>#{index + 1}</Text>
                      <Text style={styles.playerName}>
                        {item.name?.trim() || "unknown"}
                      </Text>
                    </View>

                    <View style={styles.rightInfo}>
                      <Text style={styles.score}>{item.score}</Text>
                    </View>
                  </View>

                  {index < players.length && <View style={styles.divider} />}
                </View>
              )}
            />
          ) : (
            <Text style={styles.bodyText}>No players found.</Text>
          )}
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[commonStyles.button, commonStyles.dangerButton]}
            onPress={handleDelete}
          >
            <Text style={commonStyles.buttonText}>Delete Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentPadding: {
    padding: 20,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  labelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
  },
  smallText: {
    fontSize: 14,
    color: "#666",
  },
  priceText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007AFF",
  },
  header: {
    marginBottom: 24,
  },
  category: {
    fontSize: 16,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  playerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  playerInfo: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  rank: {
    width: 30,
    color: "#999",
  },
  playerName: {
    fontWeight: "500",
    flex: 1,
    color: "#333",
    fontSize: 16,
  },
  rightInfo: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  score: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
    width: 50,
    textAlign: "right",
  },
  actionButtonsContainer: {
    gap: 12,
    marginTop: 20,
    marginBottom: 30,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 6,
  },
});
