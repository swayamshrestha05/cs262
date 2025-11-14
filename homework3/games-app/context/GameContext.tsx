/**
 * ItemContext - React Context for managing application items
 *
 * This context provides centralized state management for the item list,
 * including the ability to delete items. Items are loaded from a JSON file
 * and managed in component state.
 *
 * @example
 * ```tsx
 * // Wrap your app with the provider
 * <ItemProvider>
 *   ... app components ...
 * </ItemProvider>
 *
 * // Use in components
 * const { items, deleteItem } = useItemContext();
 * ```
 */

import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { Game } from "../types/Item";

/**
 * This context type defines the shape of the context value that includes
 * the items array and a function to delete items by their unique identifier.
 *
 * @interface ItemContextType
 * @property items - Array of all available items
 * @property deleteItem - Function to remove an item by its ID
 */
interface GameContextType {
  games: Game[];
  deleteGame: (id: number) => void;
}

/**
 * This creates and exports the context for item state management.
 * It returns undefined if used outside of ItemProvider, which allows
 * components to detect if they're properly wrapped.
 */
export const GameContext = createContext<GameContextType | undefined>(
  undefined
);

/**
 * This creates and exports the provider component.
 *
 * It initializes items from JSON data and provides methods to manipulate them,
 * using React state to manage them.
 *
 * @param children - React components that need access to item context
 */
export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize items from imported JSON data
  const [games, setGames] = useState<Game[]>([]);

  //   Fetching items from the URL
  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch(
          "https://monopoly-service-fwb0djd9etgre8cr.canadacentral-01.azurewebsites.net/games"
        );
        const json = await response.json();
        setGames(json);
      } catch (error) {
        console.error(error);
      }
    }

    fetchGames();
  }, []);

  /**
   * Removes an item from the list by filtering out the matching ID
   *
   * Uses React.useCallback to memoize the function, which prevents
   * unnecessary re-renders of child components that receive this
   * function as a prop.
   *
   * @param id - The unique identifier of the item to delete
   */
  const deleteGame = React.useCallback((id: number) => {
    setGames((prevGames) => prevGames.filter((game) => game.id !== id));
  }, []); // Empty dependency array - function doesn't depend on any props or state

  // Context value object containing all state and actions
  const value: GameContextType = {
    games,
    deleteGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

/**
 * Custom hook to safely access ItemContext
 *
 * It handles the null check and provides a helpful error message if used
 * outside of ItemProvider. This eliminates boilerplate in components.
 *
 * @returns The context value containing items and deleteItem function
 * @throws Error if used outside of ItemProvider
 */
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within an ItemProvider");
  }
  return context;
};
