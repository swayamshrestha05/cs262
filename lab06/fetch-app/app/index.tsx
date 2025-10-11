import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

type Item = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
};

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Item[]>([]);

  const getItems = async () => {
    try {
      const response = await fetch(
        "https://cs.calvin.edu/courses/cs/262/kvlinden/05design/data/items.json"
      );
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <View style={{ flex: 1, padding: 24 }}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={({ id }) => id}
          renderItem={({ item }) => (
            <Text>
              {item.title}, {item.category}, ${item.price}
            </Text>
          )}
        />
      )}
    </View>
  );
};

export default App;
