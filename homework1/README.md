a.
Object:
type Todo = {
id: string;
text: string;
completed: boolean;
editing?: boolean;
};

Anonymous funtion:
const completedCount = useMemo(
() => todos.filter((t) => t.completed).length,
[todos]
);

The app doesn't need the useMemo because the app is small and doesn't require memoizing the result of a function.

Asynchronous programming:
Doesn't use asynchronous programming

Modules:
import React, { useMemo, useRef, useState } from "react";
import { Alert, FlatList, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

Typescript:
const [todos, setTodos] = useState<Todo[]>([]);

CSS:
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
})

b. Initially, Copilot wasn't generating code after providing the prompt and was stuck on "working". So I deleted the app and created a new one. After giving the prompt, Copilot correctly generated a good base for the todo app. After a few tweaks, the app was functioning and looking as expected.
