import React, { useMemo, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  editing?: boolean;
};

export default function Index() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newText, setNewText] = useState("");
  const inputRef = useRef<TextInput | null>(null);

  const completedCount = useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos]
  );

  function addTodo() {
    const text = newText.trim();
    if (!text) return;
    const next: Todo = {
      id: String(Date.now()) + Math.random().toString(36).slice(2, 9),
      text,
      completed: false,
    };
    setTodos((s) => [next, ...s]);
    setNewText("");
    inputRef.current?.blur();
    Keyboard.dismiss();
  }

  function toggleComplete(id: string) {
    setTodos((s) =>
      s.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function startEdit(id: string) {
    setTodos((s) =>
      s.map((t) =>
        t.id === id ? { ...t, editing: true } : { ...t, editing: false }
      )
    );
  }

  function saveEdit(id: string, text: string) {
    const trimmed = text.trim();
    if (!trimmed) {
      Alert.alert("Validation", "Todo text cannot be empty");
      return;
    }
    setTodos((s) =>
      s.map((t) => (t.id === id ? { ...t, text: trimmed, editing: false } : t))
    );
  }

  function cancelEdit(id: string) {
    setTodos((s) => s.map((t) => (t.id === id ? { ...t, editing: false } : t)));
  }

  function deleteTodo(id: string) {
    setTodos((s) => s.filter((t) => t.id !== id));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={styles.counter}
        >{`${completedCount} of ${todos.length} completed`}</Text>
      </View>

      <View style={styles.addRow}>
        <TextInput
          ref={inputRef}
          placeholder="Add a new todo..."
          value={newText}
          onChangeText={setNewText}
          style={styles.input}
          onSubmitEditing={addTodo}
          returnKeyType="done"
        />
        <Pressable onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Pressable
              onPress={() => toggleComplete(item.id)}
              style={[styles.checkbox, item.completed && styles.checkboxOn]}
            >
              <Text style={styles.checkboxText}>
                {item.completed ? "✓" : ""}
              </Text>
            </Pressable>

            {item.editing ? (
              <TextInput
                style={[styles.itemText, styles.editInput]}
                defaultValue={item.text}
                onSubmitEditing={(e) => saveEdit(item.id, e.nativeEvent.text)}
                onBlur={() => cancelEdit(item.id)}
                autoFocus
                returnKeyType="done"
              />
            ) : (
              <Pressable
                style={styles.itemTextWrap}
                onLongPress={() => startEdit(item.id)}
              >
                <Text
                  style={[
                    styles.itemText,
                    item.completed && styles.itemTextCompleted,
                  ]}
                >
                  {item.text}
                </Text>
              </Pressable>
            )}

            <View style={styles.itemActions}>
              <Pressable
                onPress={() => deleteTodo(item.id)}
                style={styles.actionButton}
              >
                <Text style={[styles.actionText, { color: "#d00" }]}>
                  Delete
                </Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyRow}>
            <Text style={styles.emptyText}>No todos yet — add one above.</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { marginBottom: 12 },
  title: { fontSize: 24, fontWeight: "700" },
  counter: { marginTop: 4, color: "#555" },
  addRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: "#2f95dc",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: { color: "#fff", fontWeight: "600" },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxOn: { backgroundColor: "#2f95dc", borderColor: "#2f95dc" },
  checkboxText: { color: "#fff", fontWeight: "700" },
  itemTextWrap: { flex: 1 },
  itemText: { fontSize: 16 },
  itemTextCompleted: { textDecorationLine: "line-through", color: "#888" },
  itemActions: { flexDirection: "row", marginLeft: "auto" },
  actionButton: { paddingHorizontal: 8, paddingVertical: 4 },
  actionText: { color: "#2f95dc" },
  emptyRow: { padding: 24, alignItems: "center" },
  emptyText: { color: "#666" },
  editInput: {
    flex: 1,
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});
