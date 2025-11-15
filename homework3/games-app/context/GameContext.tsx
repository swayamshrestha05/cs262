/**
 * GameContext - React Context for managing the list of games
 *
 * This context provides centralized state management for the game list,
 * including loading game data from the REST service.
 *
 * @example
 * ```tsx
 * <GamesProvider>
 *   ... app components ...
 * </GamesProvider>
 *
 * // Usage:
 * const { games, refreshGames } = useGamesContext();
 * ```
 */

import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { Game, GamePlayer } from "../types/Monopoly";

/**
 * This context type defines the shape of the context value that includes
 * the games array and a function to refresh (reload) them from the server.
 *
 * @interface GamesContextType
 * @property games - Array of all games retrieved from the API
 * @property refreshGames - Function to reload the game list from the API
 */
interface GamesContextType {
  games: Game[];
  refreshGames: () => Promise<void>;
  deleteGame: (id: number) => Promise<void>;
  fetchPlayers: (gameID: number) => Promise<GamePlayer[]>;
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
}

/**
 * This creates and exports the context for game state management.
 * It returns undefined if used outside of GameProvider, which allows
 * components to detect if they're properly wrapped.
 */
export const GamesContext = createContext<GamesContextType | undefined>(
  undefined
);

/**
 * Provides the context to the entire app.
 *
 * It fetches game data from the REST API on mount and makes it available
 * to all children components via React Context.
 *
 * @param children - React components that need access to game context
 */
export const GamesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [games, setGames] = useState<Game[]>([]);

  const BASE_URL = "http://153.106.223.189:3000";

  const refreshGames = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/games`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json: Game[] = await response.json();
      setGames(json);
    } catch (error) {
      console.error("Failed to load games:", error);
    }
  }, []);

  /**
   * Deletes a game by ID from the REST API and updates local state.
   */
  const deleteGame = useCallback(async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/games/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      // Update local state to remove the deleted game
      setGames((prev) => prev.filter((game) => game.id !== id));
      console.log(`Game ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting game:", error);
    }
  }, []);

  const fetchPlayers = useCallback(
    async (gameID: number): Promise<GamePlayer[]> => {
      try {
        const response = await fetch(`${BASE_URL}/games/${gameID}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const raw = await response.json();
        // Backend returns {name, score} - map to GamePlayer
        const players: GamePlayer[] = Array.isArray(raw)
          ? raw.map((row: any, idx: number) => ({
              id: row.id ?? idx,
              name: row.name ?? "unknown",
              score: typeof row.score === "number" ? row.score : 0,
            }))
          : [];
        return players;
      } catch (error) {
        console.error("Failed to load players for game:", error);
        return [];
      }
    },
    []
  );

  useEffect(() => {
    refreshGames();
  }, [refreshGames]);

  return (
    <GamesContext.Provider
      value={{ games, refreshGames, deleteGame, fetchPlayers, setGames }}
    >
      {children}
    </GamesContext.Provider>
  );
};

/**
 * Custom hook for safely accessing the GamesContext.
 *
 * It handles the null check and provides a helpful error message if used
 * outside of GameProvider. This eliminates boilerplate in components.
 *
 * @returns The context value containing game and deleteGame function
 * @throws Error if used outside of GameProvider
 */
export const useGamesContext = () => {
  const context = useContext(GamesContext);
  if (!context) {
    throw new Error("useGamesContext must be used within a GamesProvider");
  }
  return context;
};
