import { useGameContext } from "@/context/GameContext";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Game, PlayerGame, defaultGame } from "../types/Item";
import { commonStyles } from "../styles/common";

export default function Details() {
  const { gameId } = useLocalSearchParams();
  const router = useRouter();
  const id = Number(gameId);

  const { games, deleteGame, fetchPlayers } = useGameContext();

  // Local state for selected game and players
  const selectedGame: Game = games.find((g) => g.id === id) || defaultGame;
  const [players, setPlayers] = useState<PlayerGame[]>([]);

  // Fetch players for the game on component mount
  useEffect(() => {
    if (!id) return;

    const loadPlayers = async () => {
      const data = await fetchPlayers(id);
      setPlayers(data);
    };

    loadPlayers();
  }, [id, fetchPlayers]);

  // Delete the game via Web Service first
  const handleDelete = async () => {
    if (!selectedGame.id) return;

    const deleteConfirmed =
      Platform.OS === "web"
        ? typeof window !== "undefined" &&
          window.confirm(`Delete Game #${selectedGame.id}?`)
        : await new Promise<boolean>((resolve) => {
            Alert.alert(
              "Delete Game",
              `Are you sure you want to delete Game #${selectedGame.id}?`,
              [
                {
                  text: "Cancel",
                  style: "cancel",
                  onPress: () => resolve(false),
                },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => resolve(true),
                },
              ]
            );
          });

    if (!deleteConfirmed) return;

    try {
      // Delete from Web Service
      const response = await fetch(
        `https://monopoly-service-fwb0djd9etgre8cr.canadacentral-01.azurewebsites.net/games/${selectedGame.id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete game from server");

      // Delete from local state
      deleteGame(selectedGame.id);
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to delete game. Try again later.");
    }
  };

  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.contentPadding}>
        <View style={styles.header}>
          <Text style={styles.titleText}>Game #{selectedGame.id}</Text>
          <Text style={styles.timeText}>Time: {selectedGame.time}</Text>
        </View>

        <View style={styles.playersContainer}>
          <Text style={styles.sectionTitle}>Players & Scores</Text>
          {players.length === 0 ? (
            <Text style={styles.noPlayers}>
              No players found for this game.
            </Text>
          ) : (
            players.map((p) => (
              <View key={p.playerID} style={styles.playerRow}>
                <Text style={styles.playerText}>ID: {p.playerID}</Text>
                <Text style={styles.playerText}>Score: {p.score}</Text>
              </View>
            ))
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
  header: {
    marginBottom: 24,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  timeText: {
    fontSize: 18,
    color: "#666",
  },
  playersContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  noPlayers: {
    fontSize: 16,
    color: "#999",
  },
  playerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  playerText: {
    fontSize: 16,
    color: "#333",
  },
  actionButtonsContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
});
