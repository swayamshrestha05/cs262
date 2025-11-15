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
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Game, PlayerGameWithDetails } from "../types/Item"; // Changed import
import { commonStyles } from "../styles/common";

export default function Details() {
  const { gameId } = useLocalSearchParams();
  const router = useRouter();
  const id = Number(gameId);

  const { deleteGame, fetchPlayers } = useGameContext();

  // Local state for selected game and players
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<PlayerGameWithDetails[]>([]); // Changed type
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch game details and players on component mount
  useEffect(() => {
    if (!id || isNaN(id)) {
      setError("Invalid game ID");
      setLoading(false);
      return;
    }

    const loadGameData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch game details
        const gameResponse = await fetch(
          `https://monopoly-service-fwb0djd9etgre8cr.canadacentral-01.azurewebsites.net/games/${id}`
        );

        if (!gameResponse.ok) {
          if (gameResponse.status === 404) {
            setError("Game not found");
          } else {
            setError("Failed to load game");
          }
          setLoading(false);
          return;
        }

        const gameData = await gameResponse.json();
        setSelectedGame(gameData);

        // Fetch players for the game
        const playerData = await fetchPlayers(id);
        setPlayers(playerData);
      } catch (error) {
        console.error("Error loading game data:", error);
        setError("Failed to load game data");
      } finally {
        setLoading(false);
      }
    };

    loadGameData();
  }, [id, fetchPlayers]);

  // Delete the game via Web Service first
  const handleDelete = async () => {
    if (!selectedGame?.id) return;

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

  // Show loading state
  if (loading) {
    return (
      <View style={[commonStyles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading game details...</Text>
      </View>
    );
  }

  // Show error state
  if (error || !selectedGame) {
    return (
      <View style={[commonStyles.container, styles.centerContainer]}>
        <Text style={styles.errorText}>{error || "Game not found"}</Text>
        <TouchableOpacity
          style={[commonStyles.button, { marginTop: 20 }]}
          onPress={() => router.back()}
        >
          <Text style={commonStyles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show game details
  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.contentPadding}>
        <View style={styles.header}>
          <Text style={styles.titleText}>Game #{selectedGame.id}</Text>
          <Text style={styles.timeText}>
            Time: {selectedGame.time || "N/A"}
          </Text>
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
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>
                    #{p.playerID} - {p.name || "Unknown"}
                  </Text>
                  {p.email && <Text style={styles.playerEmail}>{p.email}</Text>}
                </View>
                <Text style={styles.playerScore}>{p.score}</Text>
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 12,
    color: "#333",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 18,
    color: "#e74c3c",
    textAlign: "center",
  },
  noPlayers: {
    fontSize: 16,
    color: "#999",
    fontStyle: "italic",
  },
  playerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  playerEmail: {
    fontSize: 14,
    color: "#666",
  },
  playerScore: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
    marginLeft: 12,
  },
  actionButtonsContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
});
