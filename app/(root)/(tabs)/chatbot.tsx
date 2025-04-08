import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Client,ID } from "react-native-appwrite"; // Import Appwrite config
import { databases } from "@/lib/appwrite";

export default function ChatScreen() {
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [chatHistory, setChatHistory] = useState<{ sessionId: string; messages: { sender: "user" | "bot"; text: string }[] }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const FASTAPI_URL = "https://wellnex-backend.vercel.app/chat";
  const DATABASE_ID = "67bd43150023c2506475"; // Replace with your Database ID
  const COLLECTION_ID = "67e006dc003e34672854"; // Replace with your Collection ID

  // Initialize chat on app start
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Load previous chat sessions from Appwrite
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
        const history = response.documents.map(doc => ({
          sessionId: doc.sessionId,
          messages: JSON.parse(doc.messages), // Parse stringified JSON back to array
        }));
        setChatHistory(history);

        // Start with a fresh chat
        setMessages([]);
      } catch (error) {
        console.error("Error initializing chat:", error);
      }
    };
    initializeChat();
  }, []);

  // Save current session to Appwrite when the app unmounts or restarts
  useEffect(() => {
    const saveSessionOnUnmount = async () => {
      if (messages.length > 0) {
        try {
          const sessionId = ID.unique();
          await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            {
              sessionId: sessionId,
              messages: JSON.stringify(messages), // Stringify the messages array
              createdAt: new Date().toISOString(),
              userId: "user1", // Replace with actual user ID if needed
            }
          );
          console.log("Session saved to Appwrite");
        } catch (error) {
          console.error("Error saving session:", error);
        }
      }
    };

    // Save session when the component unmounts
    return () => {
      saveSessionOnUnmount();
    };
  }, [messages]);

  // Scroll to the bottom when messages update
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Send message to the backend
  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setIsLoading(true);

    const requestBody = { user_input: input };

    try {
      const response = await fetch(FASTAPI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      const formattedResponse = formatApiResponse(data.response);
      setMessages((prev) => [...prev, { sender: "bot", text: formattedResponse }]);
    } catch (error) {
      console.error("Error communicating with FastAPI:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Oops! Something went wrong." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear the current chat session
  const clearChat = async () => {
    setMessages([]);
  };

  // Format API response for display
  const formatApiResponse = (text: string) => {
    return text.replace(/\n/g, "\n");
  };

  // Render message content with formatting
  const renderMessageContent = (text: string) => {
    const parts = text.split("\n");
    return parts.map((part, idx) => {
      const isHeader = part.includes("Recommendations:") || part.endsWith(":");
      return (
        <Text
          key={idx}
          style={[
            styles.messageText,
            isHeader ? styles.headerText : null,
            part.trim() === "" ? styles.spacer : null,
          ]}
        >
          {part}
        </Text>
      );
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? -60 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setIsHistoryOpen(true)} style={styles.headerButton}>
            <Ionicons name="time-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>WellNex</Text>
          </View>
          <TouchableOpacity onPress={clearChat} style={styles.headerButton}>
            <Ionicons name="trash-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Chat Messages */}
        <View style={{ flex: 1 }}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatContainer}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
          >
            {messages.length === 0 ? (
              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeText}>
                  Welcome to WellNex! Ask me about workouts or nutrition plans.
                </Text>
                <Text style={styles.welcomeExamples}>Try examples like:</Text>
                <View style={styles.exampleContainer}>
                  <Text style={styles.exampleText}>• "Give me a chest workout"</Text>
                  <Text style={styles.exampleText}>• "Suggest meals for bulking"</Text>
                  <Text style={styles.exampleText}>• "Biceps workout and protein meals"</Text>
                </View>
              </View>
            ) : (
              messages.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.messageBubble,
                    item.sender === "user" ? styles.userBubble : styles.botBubble,
                  ]}
                >
                  {item.sender === "user" ? (
                    <Text style={styles.messageText}>{item.text}</Text>
                  ) : (
                    renderMessageContent(item.text)
                  )}
                </View>
              ))
            )}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#ff4d4d" />
                <Text style={styles.loadingText}>Getting recommendations...</Text>
              </View>
            )}
            <View style={styles.scrollBuffer} />
          </ScrollView>
        </View>

        {/* History Modal */}
        <Modal
          visible={isHistoryOpen}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsHistoryOpen(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView style={styles.modalScrollView}>
                {chatHistory.length === 0 ? (
                  <Text style={styles.noHistoryText}>No chat history</Text>
                ) : (
                  chatHistory.map((session, sessionIndex) => (
                    <View key={session.sessionId}>
                      <Text style={styles.sessionHeader}>Session {sessionIndex + 1}</Text>
                      {session.messages.map((item, index) => (
                        <View
                          key={index}
                          style={[
                            styles.messageBubble,
                            item.sender === "user" ? styles.userBubble : styles.botBubble,
                          ]}
                        >
                          {item.sender === "user" ? (
                            <Text style={styles.messageText}>{item.text}</Text>
                          ) : (
                            renderMessageContent(item.text)
                          )}
                        </View>
                      ))}
                    </View>
                  ))
                )}
              </ScrollView>
              <TouchableOpacity onPress={() => setIsHistoryOpen(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Input Section */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { maxHeight: 100 }]}
            placeholder="Type your message here..."
            placeholderTextColor="#888"
            value={input}
            onChangeText={setInput}
            multiline={true}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Ionicons name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Styles
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    backgroundColor: "#111",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  chatContent: {
    padding: 16,
    paddingBottom: 60,
    flexGrow: 1,
  },
  welcomeContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: 40,
  },
  welcomeText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  welcomeExamples: {
    color: "#ccc",
    fontSize: 16,
    marginBottom: 10,
  },
  exampleContainer: {
    width: width * 0.8,
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 16,
  },
  exampleText: {
    color: "#ddd",
    fontSize: 16,
    marginBottom: 10,
  },
  messageBubble: {
    marginVertical: 6,
    padding: 12,
    borderRadius: 16,
    maxWidth: "85%",
  },
  userBubble: {
    backgroundColor: "#dc2626",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: "#222",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 22,
  },
  headerText: {
    fontWeight: "bold",
    marginTop: 4,
    marginBottom: 2,
  },
  spacer: {
    height: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 16,
    marginVertical: 6,
  },
  loadingText: {
    color: "#ccc",
    marginLeft: 8,
    fontSize: 14,
  },
  scrollBuffer: {
    height: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#222",
    padding: 12,
    backgroundColor: "#111",
    marginBottom: 60,
  },
  input: {
    flex: 1,
    minHeight: 45,
    backgroundColor: "#222",
    borderRadius: 22,
    color: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#dc2626",
    width: 45,
    height: 45,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#111",
    width: "90%",
    height: "80%",
    borderRadius: 12,
    padding: 16,
  },
  modalScrollView: {
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 4,
  },
  noHistoryText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  sessionHeader: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
});