/**
 * GameContext - React Context for managing games and players
 *
 * This context provides centralized state management for the game list,
 * including the ability to delete games and fetch players for a specific game.
 *
 * @example
 * ```tsx
 * // Wrap your app with the provider
 * <GameProvider>
 *   ... app components ...
 * </GameProvider>
 *
 * // Use in components
 * const { games, deleteGame, fetchPlayers } = useGameContext();
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
import { Game, PlayerGameWithDetails } from "../types/Item";

/**
 * This context type defines the shape of the context value that includes
 * the games array, a function to delete games, and a function to fetch players.
 *
 * @interface GameContextType
 * @property games - Array of all available games
 * @property deleteGame - Function to remove a game by its ID
 * @property fetchPlayers - Function to fetch players for a specific game
 */
interface GameContextType {
  games: Game[];
  deleteGame: (id: number) => void;
  fetchPlayers: (gameId: number) => Promise<PlayerGameWithDetails[]>; // Changed return type
}

const API_BASE_URL =
  "https://monopoly-service-fwb0djd9etgre8cr.canadacentral-01.azurewebsites.net";

/**
 * This creates and exports the context for game state management.
 * It returns undefined if used outside of GameProvider, which allows
 * components to detect if they're properly wrapped.
 */
export const GameContext = createContext<GameContextType | undefined>(
  undefined
);

/**
 * This creates and exports the provider component.
 *
 * It initializes games from the API and provides methods to manipulate them,
 * using React state to manage them.
 *
 * @param children - React components that need access to game context
 */
export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize games from API
  const [games, setGames] = useState<Game[]>([]);

  // Fetch games from the API on mount
  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch(`${API_BASE_URL}/games`);
        const json = await response.json();
        setGames(json);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    }

    fetchGames();
  }, []);

  /**
   * Removes a game from the list by filtering out the matching ID
   *
   * Uses React.useCallback to memoize the function, which prevents
   * unnecessary re-renders of child components that receive this
   * function as a prop.
   *
   * @param id - The unique identifier of the game to delete
   */
  const deleteGame = useCallback((id: number) => {
    setGames((prevGames) => prevGames.filter((game) => game.id !== id));
  }, []);

  /**
   * Fetches players for a specific game from the API
   *
   * This function calls the /games/:id/players endpoint to retrieve
   * all players associated with a particular game, including their
   * scores, names, and email addresses.
   *
   * @param gameId - The unique identifier of the game
   * @returns Promise resolving to an array of PlayerGame objects
   */
  const fetchPlayers = useCallback(
    async (gameId: number): Promise<PlayerGameWithDetails[]> => {
      // Changed return type
      try {
        const response = await fetch(`${API_BASE_URL}/games/${gameId}/players`);
        if (!response.ok) {
          throw new Error(`Failed to fetch players: ${response.statusText}`);
        }
        const json = await response.json();
        return json;
      } catch (error) {
        console.error(`Error fetching players for game ${gameId}:`, error);
        return [];
      }
    },
    []
  );
  // Context value object containing all state and actions
  const value: GameContextType = {
    games,
    deleteGame,
    fetchPlayers,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

/**
 * Custom hook to safely access GameContext
 *
 * It handles the null check and provides a helpful error message if used
 * outside of GameProvider. This eliminates boilerplate in components.
 *
 * @returns The context value containing games, deleteGame, and fetchPlayers
 * @throws Error if used outside of GameProvider
 */
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
